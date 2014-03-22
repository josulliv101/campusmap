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
    MapHandleTruthChangeStrategy.prototype.handleCenter = function(model, val, key, viz) {

        if (key !== 'center' || !_.isObject(val)) return;

        viz.setCenter(val);

    };

    MapHandleTruthChangeStrategy.prototype.handleCursor = function(model, val, key, viz) {

        if (key !== 'cursor' || !_.isString(val)) return;

        viz.setCursor(val);

    };

    MapHandleTruthChangeStrategy.prototype.handleZoom = function(model, val, key, viz) {

        if (key !== 'zoom' || !_.isNumber(val)) return;

        viz.setZoom(val);

    };

    MapHandleTruthChangeStrategy.prototype.handleLocations = function(model, val, key, viz) {

        if (key !== 'locations' || !_.isArray(val)) return;

        viz.renderLabelOverlay(val);

    };

    MapHandleTruthChangeStrategy.prototype.handleCloseByLocations = function(model, val, key, viz) {

        if (key !== 'locationscloseby' || !_.isArray(val)) return;
debugger;
        viz.refreshLabelCss(model.locations, val);

    };

    MapHandleTruthChangeStrategy.prototype.dispatch = _.dispatch( 

        MapHandleTruthChangeStrategy.prototype.handleMapType,

        MapHandleTruthChangeStrategy.prototype.handleCenter,

        MapHandleTruthChangeStrategy.prototype.handleCursor,

        MapHandleTruthChangeStrategy.prototype.handleZoom,

        MapHandleTruthChangeStrategy.prototype.handleLocations,

        MapHandleTruthChangeStrategy.prototype.handleCloseByLocations

    );

    return MapHandleTruthChangeStrategy;

});
