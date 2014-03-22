define([

    'underscore'

    , 'eventdispatcher'

    , '_mixins'

], function(_, EventDispatcher) {

    'use strict';


    function StateManagementStrategy() {

        this.type = 'truth-data-transformer';

    }

    // Toggles a Boolean value of an attribute
    StateManagementStrategy.prototype.toggle = function(model, val, key, MapUtils) {

        if (val !== 'toggle') return;

        return  val = !model[key];

    };

    // This needs to be
    StateManagementStrategy.prototype.mapTileHoverToCloseByLocations = function(model, val, key, MapUtils) {

        var locations, closeby;

        if (key !== 'maptilehover') return;

        // Reset
        _.each(model.locations, function(model) { return model.isCloseBy = false; });

        // Memoize this?
        closeby = MapUtils.getCloseByLocationsFromTileCache(val.tile, val.zoom);

        _.each(closeby, function(loc) { return loc.isCloseBy = true; });

        console.log('closeby locs', closeby.length);

        EventDispatcher.trigger('truthupdate', { locationscloseby: closeby });

        return  val;

    };


    StateManagementStrategy.prototype.dispatch = _.dispatch( 

        StateManagementStrategy.prototype.toggle,

        StateManagementStrategy.prototype.mapTileHoverToCloseByLocations

    );

    return StateManagementStrategy;

});
