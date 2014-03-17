define([

    'underscore'

    , '_mixins'

], function(_) {

    'use strict';

    // These ar changes which do not require a re-rendering in any way
    function MapHandleTruthChangeStrategy() {

        this.type = 'truth-handler';

    }

    // Change to a new map type
    MapHandleTruthChangeStrategy.prototype.handleMapType = function(model, val, key, viz) {

        if (key !== 'maptype') return;

        viz.setMapType(val);

    };

    // Lat/Lng should already be converted to object if it was initially a string
    MapHandleTruthChangeStrategy.prototype.handleLatLng = function(model, val, key, viz) {

        if (key !== 'latlng' || !_.isObject(val)) return;

        viz.setCenter(val);

    };

    MapHandleTruthChangeStrategy.prototype.handleCursor = function(model, val, key, viz) {

        if (key !== 'cursor' || !_.isString(val)) return;

        viz.setCursor(val);

    };


    MapHandleTruthChangeStrategy.prototype.dispatch = _.dispatch( 

        MapHandleTruthChangeStrategy.prototype.handleMapType,

        MapHandleTruthChangeStrategy.prototype.handleLatLng,

        MapHandleTruthChangeStrategy.prototype.handleCursor

    );

    return MapHandleTruthChangeStrategy;

});
