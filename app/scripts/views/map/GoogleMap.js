
define([

    'jquery',

    '_mixins',

    'eventdispatcher',

    'async!http://maps.google.com/maps/api/js?sensor=false'

], function($, _, EventDispatcher) {

    'use strict';

    // google object is now available
    
    var gMap;


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

    return {

        clear: clear_,

        getCenter: getCenter_,

        render: render_,

        setCenter: setCenter_,

        setCursor: setCursor_,

        setMapType: setMapType_,

        setZoom: setZoom_

    };

});
