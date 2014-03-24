
define([

    'jquery'

    , '_mixins'

    , 'scripts/config'

    , 'scripts/views/map/LabelMapType'

    , 'scripts/utils/MapUtils'

    , 'eventdispatcher'

    , 'async!http://maps.google.com/maps/api/js?sensor=false'

], function($, _, Config, LabelMapType, MapUtils, EventDispatcher) {

    'use strict';

    // google object is now available
    var api = google;
    
    function GoogleMapView(options) {

        // Grab first maptype as default, or use google roadmap
        var defaultMapType = _.chain(Config.googlemap.maptypes).keys().first().value() || google.maps.MapTypeId.ROADMAP;

        options || (options = {});

        // Map DOM element required
        if (!options.el) Config.throwError.mapViewInit();

        // Needs a temporary center lat/lng to initialize.
        this.map = new api.maps.Map(options.el, _.defaults(Config.googlemap.attrs(api), { center: { lat: 0, lng: 0 } }));

        // Create a matype for each maptype in config (either style-related or custom tiles)
        _.each(Config.googlemap.maptypes, function(data, maptypeid) { 

            // Styled tiles
            if (_.isArray(data.styles)) this.map.mapTypes.set(maptypeid, new google.maps.StyledMapType(data.styles)); 

            // Custom tile images
            else if (_.isFunction(data.tiles)) this.map.mapTypes.set(maptypeid, data.tiles(api)); 

        }, this);
 

        this.map.setMapTypeId(defaultMapType);

        // Add the Label map type overlay
        this.labelLayer = new LabelMapType(new google.maps.Size(256, 256), MapUtils);


        // Make sure the Truth gets updated if zoom is changed through the map interface directly (scrollwheel, doubleclick)
        google.maps.event.addListener(this.map, 'zoom_changed', function(ev) {

            EventDispatcher.trigger('truthupdate', { zoom: this.getZoom() });

        });

        google.maps.event.addListener(this.map, 'mousemove', function (ev) { // _.throttle()
          
            var  loc, mouse, closeby, locAtPoint, zoom = this.getZoom(), latlng = ev.latLng;

            mouse = MapUtils.latLngToTileOffset_({ lat: latlng.lat(), lng: latlng.lng() }, zoom);

            // The tile the mouse is currently over. When this changes, the <Array>locationscloseby Truth attr is updated.
            //EventDispatcher.trigger('truthupdate', { maptilehover: _.omit(mouse, 'offset') });

            // getCloseByLocationsFromTileCache is memoized
            closeby = MapUtils.getLocationsFromTileCache(mouse.tile, mouse.zoom);

            _.each(closeby, function(loc) {

                GoogleMapView.prototype.setLocationDimensions.call(null, loc);

            }, this);

            locAtPoint = _.chain(closeby)

                          .reject(function(loc) { return loc.dimensions === undefined; })

                          .filter(function(loc) { 

                                return mouse.offset.x > loc.offsetx - 10

                                        && mouse.offset.x < (loc.offsetx + loc.dimensions.width - 6)

                                        && mouse.offset.y > (loc.offsety  - 10)

                                        && mouse.offset.y < (loc.offsety + loc.dimensions.height - 6);
                           })

                          .first()

                          .value();

            EventDispatcher.trigger('truthupdate', { hover: locAtPoint });

        });

    }

    GoogleMapView.prototype.handleLatLng_ = function(ev) {

        console.log('handleLatLng', ev);

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

    GoogleMapView.prototype.setLocationDimensions = function(location) {

        var $el = $('#' + location.id);

        if (!$el[0]) return;

        location.dimensions = { width: $el.outerWidth(), height: $el.outerHeight() };

    }

    GoogleMapView.prototype.refreshLabelCss = function(all, closeby) {

        _.each(all, function(loc) {

            var $loc, classes = ['location'];

            if (!loc.id) return;

            $loc = $('#' + loc.id);

            if (loc.isCloseBy === true) classes.push('closeby');

            if (loc.isHovered === true) classes.push('hover');

            $loc.removeClass().addClass(classes.join(" "));

        }, this);

        //_.each(closeby, function(loc) {

            //this.setLocationDimensions(loc);

        //}, this);

        console.log('refreshLabelCss');

    };

    GoogleMapView.prototype.renderLabelOverlay = function(locations) {

        this.labelLayer.locations = locations;

        if (this.map.overlayMapTypes.length === 1) this.map.overlayMapTypes.removeAt(0);

        // Re-renders Labels Tile Overlay
        this.map.overlayMapTypes.insertAt(0, this.labelLayer);

        this.refreshLabelCss(locations);
        // to be deleted - development only
        /*
        _.each(this.labelLayer.locations, function(loc) { 

          var marker = new google.maps.Marker({

              position: loc.latlng,

              map: this.map,

              title: loc.name

          });

        }, this);
        */

    };


    function getCenter_(zoom, offset, options) {    

    }

    function clear_() {

    }

    return GoogleMapView;

});
