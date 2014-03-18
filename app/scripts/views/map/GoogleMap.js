
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

        var config = _.extend(Config.googlemap.attrs(api), { center: new api.maps.LatLng(42.406896, -71.120526), zoom: 17 });

        options || (options = {});

        if (!options.el) Config.throwError.mapViewInit();

        this.map = new api.maps.Map(options.el, config);

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

        //return this;

    }

    return GoogleMapView;

});
