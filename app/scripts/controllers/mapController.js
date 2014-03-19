define([

    'jquery'

    , 'underscore'

    , 'strategies/controllers/MapHandleTruthChangeStrategy'

    , 'eventdispatcher'

], function($, _, MapHandleTruthChangeStrategy, EventDispatcher) {

    'use strict';


    function MapController(view) {

        _.bindAll(this, 'handleTruthChange');

        this.handleTruthStrategy = new MapHandleTruthChangeStrategy();

        this.mapView = view;

        EventDispatcher.on('delegateTruth', this.handleTruthChange);

    }

    MapController.prototype.handleTruthChange = function(changedAttrs, previousAttrs) {

        if (!this.mapView) return;

        // If there's any between-attr dependencies, they should already be process by appControl
        _.each(changedAttrs, function(val, key) {

            this.handleTruthStrategy.dispatch({}, val, key, this.mapView);

        }, this);

    };

    MapController.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);

    return MapController;

});