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
        if (changedAttrs.zoom || changedAttrs.locations) this.refreshTileCache();

        // If there's any between-attr dependencies, they should already be process by appControl
        _.each(changedAttrs, function(val, key) {

            this.handleTruthStrategy.dispatch({}, val, key, this.mapView);

        }, this);

    };

    MapController.prototype.refreshTileCache = function(changedAttrs, previousAttrs) {

        var locations = this.theTruthJSON.locations;

        MapUtils.resetCache();

        _.each(locations, function(loc) {

            var tileOffset;

            // Convert string lat/lng to objects if needed
           // if (_.isString(loc.latlng))
/*
            // Label may be a <String> -- force it into a boolean value
            if (!!loc.label !== true) return;

            // The latLngToTileOffset function caches the return value for future use
            tileOffset = MapUtils.latLngToTileOffset({ lat: loc.latlng[0], lng: loc.latlng[1] }, loc.zoom);

            MapUtils.addLocationToTileCache(tileOffset, loc);
*/

debugger;

        });

    };

    MapController.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);

    return MapController;

});