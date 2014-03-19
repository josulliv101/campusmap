
define([

    'jquery'

    , '_mixins'

    , 'scripts/config'

    , 'eventdispatcher'

    , 'async!http://maps.google.com/maps/api/js?sensor=false'

], function($, _, Config, EventDispatcher) {

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

    }

    GoogleMapView.prototype.setMapType = function(maptypeid) {

        this.map.setMapTypeId(maptypeid);

    }

    GoogleMapView.prototype.setZoom = function(level) {

        this.map.setZoom(level);

    }

    GoogleMapView.prototype.setCenter = function(latlng) {

        this.map.panTo(latlng);

    }

    function getCenter_(zoom, offset, options) {    

    }

    function setCursor_(id) {

    }

    function clear_() {

    }

    return GoogleMapView;

});
