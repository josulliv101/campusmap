
define([

    'jquery'

    , '_mixins'

    , 'scripts/config'

    , 'scripts/views/map/LabelMapType'

    , 'scripts/utils/MapUtils'

    , 'scripts/domManager'

    , 'eventdispatcher'

    , 'async!http://maps.google.com/maps/api/js?sensor=false'

], function($, _, Config, LabelMapType, MapUtils, DomManager, EventDispatcher) {

    'use strict';

    // google object is now available
    var api = google;
    
    function GoogleMapView(options) {

        // Grab first maptype as default, or use google roadmap
        var defaultMapType = _.chain(Config.googlemap.maptypes).keys().first().value() || google.maps.MapTypeId.ROADMAP,

            view = this, streetview;

        options || (options = {});

        // Map DOM element required
        if (!options.el) Config.throwError.mapViewInit();

        // Needs a temporary center lat/lng to initialize.
        this.map = new api.maps.Map(options.el, _.defaults(Config.googlemap.attrs(api), { center: { lat: 0, lng: 0 } })); 

        // Convert maptype json daata from config to real maptypes
        this.initMapTypes(Config.googlemap.maptypes);

        // The first one is the default
        this.map.setMapTypeId(defaultMapType);

        // Add the Label tile overlay
        this.labelLayer = new LabelMapType(new google.maps.Size(256, 256), MapUtils);

        // Need to listen for when streetviw is displayed
        streetview = this.streetview = this.map.getStreetView();

        this.streetview.setOptions({

          addressControl: false

        });

        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function() {

            // Workaround to make the default text appear in searchbox.
            $('.panel-search .search').trigger('click');

            google.maps.event.addListener(streetview, 'visible_changed', function() {

                // Css flag gets set root dom of app
                EventDispatcher.trigger('truthupdate', { streetview: streetview.getVisible() });

            });

        });

        // Make sure the Truth gets updated if zoom is changed through the map interface directly (scrollwheel, doubleclick)
        google.maps.event.addListener(this.map, 'zoom_changed', function(ev) {

            EventDispatcher.trigger('truthupdate', { zoom: this.getZoom() });

        });

        google.maps.event.addListener(this.map, 'mousemove', function (ev) { // _.throttle()

            var loc = view.underLatLng_(ev.latLng, this.getZoom());

            EventDispatcher.trigger('truthupdate', { hover: loc });

        });

        // Make sure unwanted mousemove events aren't triggered during a map drag
        google.maps.event.addListener(this.map, 'dragstart', function (ev) { 

            google.maps.event.clearListeners(this, 'mousemove');

        });

        google.maps.event.addListener(this.map, 'dragend', function (ev) { 

            // Add mousemove listener back
            google.maps.event.addListener(this, 'mousemove', function (ev) { // _.throttle()

                var loc = view.underLatLng_(ev.latLng, this.getZoom());

                EventDispatcher.trigger('truthupdate', { hover: loc });

            });

        });

        // Name the cb function for debug
        google.maps.event.addListener(this.map, 'click', function mapClickHandler(ev) { // _.throttle()
          
            var loc = view.underLatLng_(ev.latLng, this.getZoom()),

                panels = loc && 'details' || '';

            ev.stop();

            if (_.isObject(loc)) EventDispatcher.trigger('truthupdate', { details: loc, panels: panels, query: null, backto: null, primarylabel: _.isObject(loc) ? _.getAttr(loc, 'name'): null });

            else {

                EventDispatcher.trigger('truthupdate', { details: '', panels: '', query: null, backto: null, primarylabel: null });

            }
            // Comment for now. Causes flicker in IE
            // Remove focus from searchbox so default text is displayed
            //DomManager.unfocusAll();

        });

        // Broadcast every double click event on the map
        google.maps.event.addListener(this.map, 'dblclick', function (ev) { // _.throttle()

            ev.stop();
            
            EventDispatcher.trigger('mapdblclick', ev.latLng.toUrlValue());

        });

    }

    GoogleMapView.prototype.underLatLng_ = function(latlng, zoom) {

        var  location, mouse, mouseoffset;

        mouse = MapUtils.latLngToTileOffset_({ lat: latlng.lat(), lng: latlng.lng() }, zoom),

        mouseoffset = mouse.offset;

        // The tile the mouse is currently over. When this changes, the <Array>locationscloseby Truth attr is updated.
        //EventDispatcher.trigger('truthupdate', { maptilehover: _.omit(mouse, 'offset') });



        // Only target locations within 1 tile length in any direction
        location =   _.chain( MapUtils.getCloseByLocationsFromTileCache(mouse.tile, mouse.zoom) )

                      // Refresh location dimensions, it's style may have changed.
                      .each(MapUtils.setLocationDimensions)

                      // Makes sure an id exists -- will be used for dom el selection
                      .reject(function(loc) { return _.getAttr(loc, 'dimensions') === undefined; })

                      .filter(function(loc) { 

                            var locTile = _.getAttr(loc, 'tileCache')[zoom], size = _.getAttr(loc, 'dimensions'),

                                adjustedOffset = MapUtils.getAdjustedOffset(locTile.offset, mouse.tile, locTile.tile);

                            return mouseoffset.x > adjustedOffset.x - 10 && mouseoffset.x < (adjustedOffset.x + size.width - 6) && mouseoffset.y > (adjustedOffset.y  - 10) && mouseoffset.y < (adjustedOffset.y + size.height - 6);
                       })

                      .first()

                      .value();

        // Don't include any locations that are currently hidden
        if ( location && $('#' + _.getAttr(location, 'locationid')).is(":visible") === false) location = undefined;

        // Just in case
        mouse = null; mouseoffset = null;

        return location;

    };

    GoogleMapView.prototype.initMapTypes = function(jsonMaptypes) {

        // Create a matype for each maptype in config (either style-related or custom tiles)
        _.each(jsonMaptypes, function(data, maptypeid) { 

            // Styled tiles
            if (_.isArray(data.styles)) this.map.mapTypes.set(maptypeid, new google.maps.StyledMapType(data.styles)); 

            // Custom tile images
            else if (_.isFunction(data.tiles)) this.map.mapTypes.set(maptypeid, data.tiles(api)); 

        }, this);

    };

    GoogleMapView.prototype.setMapType = function(maptypeid) {

        this.map.setMapTypeId(maptypeid);

    };

    GoogleMapView.prototype.setZoom = function(level) {

        this.map.setZoom(level);

    };

    GoogleMapView.prototype.setCenter = function(latlng) {

        var offset = this.centeroffset || { x: 0, y: 0 };
 
        if (!latlng) return;

        // Offset it
        latlng = MapUtils.offsetLatLngByPixels(latlng, this.map.getZoom(), offset);

        this.map.panTo(latlng);

    };

    GoogleMapView.prototype.setCursor = function(cursorid) {

        this.map.setOptions({ draggableCursor: cursorid });

    };

    GoogleMapView.prototype.refreshLabelCss = function(all, closeby) {

        _.each(all, function(loc) {

            var $loc, classes, id = _.getAttr(loc, 'locationid');

            if (!id) return;

            $loc = $('#' + id);

            $loc.removeClass().addClass( DomManager.getLocationClassNames(loc) );

        }, this);

    };

    GoogleMapView.prototype.handleSearchboxCollisons = function(dimensions, zoom, latlng) {

        if (!latlng) return;

        var bounds = this.map.getBounds(), z = this.map.getZoom(),

            center = this.map.getCenter(),

            ne = bounds.getNorthEast(), sw = bounds.getSouthWest(),

            nw = { lat: ne.lat(), lng: sw.lng() },

            seAdjusted = MapUtils.offsetLatLngByPixels(nw, zoom, { x: -dimensions.width, y: -dimensions.height }),

            swAdjusted = new google.maps.LatLng(seAdjusted.lat, sw.lng()),

            neAdjusted = new google.maps.LatLng(ne.lat(), seAdjusted.lng),

            searchboxBounds = new google.maps.LatLngBounds(swAdjusted, neAdjusted),

            isCollision = searchboxBounds.contains(new google.maps.LatLng(latlng.lat, latlng.lng));
// clean up here
var ll1 =  MapUtils.worldPointToPixelCoordinate(this.map.getProjection().fromLatLngToPoint(swAdjusted), zoom);
var ll2 =  MapUtils.worldPointToPixelCoordinate(this.map.getProjection().fromLatLngToPoint(new google.maps.LatLng(latlng.lat, latlng.lng)), zoom);
var y = ll1.y - ll2.y;

            if (isCollision === true) {

                _.delay(function() {

                    EventDispatcher.trigger('truthupdate', { center: MapUtils.offsetLatLngByPixels({ lat: center.lat(), lng: center.lng() }, zoom, { x: 0, y: y+16 }) });

                }, 400);
            }
/*
  var rectangle = new google.maps.Rectangle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: this.map,
    bounds: searchboxBounds
  });*/
 
        //debugger;

    };

    GoogleMapView.prototype.setAdminMarker = function(latlng) {

        var map = this.map, am;

        if (!this.adminmarker) {

            this.adminmarker  = new google.maps.Marker({

                                    map: this.map,

                                    title: 'Drag markerto change lat/lng',

                                    draggable: true

                                });

            am = this.adminmarker;

            google.maps.event.addListener(this.adminmarker, 'dragend', function() {

                var ll = am.getPosition().toUrlValue();

                EventDispatcher.trigger('truthupdate', { adminmarker: ll.replace(/[\(\)]+/g, '') });

            });

        }

        if (_.isEmpty(latlng)) return this.adminmarker.setVisible(false);
        
        this.adminmarker.setPosition(latlng);

        this.adminmarker.setVisible(true);

    };

    GoogleMapView.prototype.renderLabelOverlay = function(locations) {

        this.labelLayer.locations = locations;

        if (this.map.overlayMapTypes.length === 1) this.map.overlayMapTypes.removeAt(0);

        // Re-renders Labels Tile Overlay
        this.map.overlayMapTypes.insertAt(0, this.labelLayer);

        //this.refreshLabelCss(locations);
        // to be deleted - development only
      /*  
        _.each(this.labelLayer.locations, function(loc) { 

          var marker = new google.maps.Marker({

              position: _.getAttr(loc, 'latlng'),

              map: this.map,

              title: _.getAttr(loc, 'name')

          });

        }, this);
        */

    };


    return GoogleMapView;

});
