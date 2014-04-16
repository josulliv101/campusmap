
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

            //console.log('mousemove');

            var loc = view.underLatLng_(ev.latLng, this.getZoom());

            EventDispatcher.trigger('truthupdate', { hover: loc });

        });

        // Make sure unwanted mousemove events aren't triggered during a map drag
        google.maps.event.addListener(this.map, 'dragstart', function (ev) { 

            console.log('dragstart');

            google.maps.event.clearListeners(this, 'mousemove');

        });

        google.maps.event.addListener(this.map, 'dragend', function (ev) { 

            console.log('dragend');

            // Add mousemove listener back
            google.maps.event.addListener(this, 'mousemove', function (ev) { // _.throttle()

                //console.log('mousemove');

                var loc = view.underLatLng_(ev.latLng, this.getZoom());

                EventDispatcher.trigger('truthupdate', { hover: loc });

            });

        });

        google.maps.event.addListener(this.map, 'click', function (ev) { // _.throttle()
          
            var loc = view.underLatLng_(ev.latLng, this.getZoom()),

                panels = loc && 'details' || '';

            ev.stop();
            
            EventDispatcher.trigger('truthupdate', { details: loc, panels: panels, query: null, backto: null, primarylabel: _.isObject(loc) ? _.getAttr(loc, 'name'): null });

            // Remove focus from searchbox so default text is displayed
            DomManager.unfocusAll();

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

        console.log('refreshLabelCss');

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
