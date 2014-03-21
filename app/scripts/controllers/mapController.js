define([

    'jquery'

    , 'underscore'

    , 'strategies/controllers/MapHandleTruthChangeStrategy'

    , 'scripts/utils/MapUtils'

    , 'eventdispatcher'

], function($, _, MapHandleTruthChangeStrategy, MapUtils, EventDispatcher) {

    'use strict';


    function MapController(view) {

        _.bindAll(this, 'handleTruthChange');

        this.handleTruthStrategy = new MapHandleTruthChangeStrategy();

        this.mapView = view;

        this.theTruthJSON = {};

        EventDispatcher.on('delegateTruth', this.handleTruthChange);

    }

    MapController.prototype.handleTruthChange = function(changedAttrs, previousAttrs) {

        _.extend(this.theTruthJSON, changedAttrs);

        if (!this.mapView) return;

        // Change in locations or zoom level warrant a refresh of the tileCache
        if (changedAttrs.zoom || changedAttrs.locations) this.refreshTileCache(this.theTruthJSON.locations, this.theTruthJSON.zoom);

        // If there's any between-attr dependencies, they should already be process by appControl
        _.each(changedAttrs, function(val, key) {

            this.handleTruthStrategy.dispatch(this.theTruthJSON, val, key, this.mapView);

        }, this);

    };

    MapController.prototype.refreshTileCache = function(locations, zoom) {

        MapUtils.resetCache();

        _.each(locations, function(loc) {

            var tileOffset;

            // Label may be a <String> -- force it into a boolean value
            //if (!!loc.label !== true) return;

            // The latLngToTileOffset function caches the return value for future use
            tileOffset = MapUtils.latLngToTileOffset(loc.latlng, this.theTruthJSON.zoom);

            MapUtils.addLocationToTileCache(tileOffset, loc);

        }, this);

        console.log('refreshTileCache', MapUtils.getTileCache());

    };

    MapController.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);

    return MapController;

});