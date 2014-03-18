
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

        // Lat/Lng objects can now be object literals (experimental version of api)!
        var config = _.extend(Config.googlemap.attrs(api), { center: { lat: 42.406896, lng: -71.120526 }, zoom: 17 });

        options || (options = {});

        // Map DOM element required
        if (!options.el) Config.throwError.mapViewInit();

        this.map = new api.maps.Map(options.el, config);

        // Create a matype for each maptype in config (either style-related or custom tiles)
        _.each(Config.googlemap.maptypes, function(data, maptypeid) { 

            // Styled tiles
            if (_.isArray(data.styles)) this.map.mapTypes.set(maptypeid, new google.maps.StyledMapType(data.styles)); 

            // Custom tile images
            else if (_.isFunction(data.tiles)) this.map.mapTypes.set(maptypeid, data.tiles(api)); 

        }, this);

        this.map.setMapTypeId('sketch');

    }

    function setCenter_(latlng, offset, zoom) {    

    }

    function getCenter_(zoom, offset, options) {    

    }

    function setCursor_(id) {

    }

    function setZoom_(level) {

    }

    function setMapType_(maptype) {

    }

    function clear_() {

    }

    function render_(el) {

    }

    return GoogleMapView;

});
