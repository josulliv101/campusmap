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

    
    StateManagementStrategy.prototype.mapTileHoverToCloseByLocations = function(model, val, key, MapUtils) {

        // Memoize this?

        var closeby, all;

        if (key !== 'maptilehover') return;

        all = model.get('locations');

        closeby = MapUtils.getCloseByLocationsFromTileCache(val.tile, val.zoom);

        _.each(all, function(loc) { loc.isCloseBy = _.contains(closeby, loc); });

        console.log('closeby locs', closeby.length);

        EventDispatcher.trigger('truthupdate', { locationscloseby: closeby });

        return  val;

    };

    StateManagementStrategy.prototype.detailsLocation = function(model, val, key, MapUtils) {

        var all;

        if (key !== 'details') return;

        all = model.get('locations');

        _.each(all, function(loc) { loc.isDetails = (val && val.id ? loc.id === val.id : false); });

        EventDispatcher.trigger('truthupdate', { panels: _.isObject(val) ? 'panel3' : '' });

        return  val;

    };

    StateManagementStrategy.prototype.hoveredLocation = function(model, val, key, MapUtils) {

        var all;

        if (key !== 'hover') return;

        all = model.get('locations');

        _.each(all, function(loc) { loc.isHovered = (val && val.id ? loc.id === val.id : false); });

        // Change the cursor to the pointer when hovering over a label
        EventDispatcher.trigger('truthupdate', { cursor: val && !_.isEmpty(val) ? 'pointer' : '' });

        return  val;

    };

    StateManagementStrategy.prototype.panels = function(model, val, key, MapUtils) {

        if (key !== 'panels') return;

        // Change the cursor to the pointer when hovering over a label
        EventDispatcher.trigger('truthupdate', { 'searchbox-open': !_.isEmpty(val) });

        return  val;

    };


    StateManagementStrategy.prototype.dispatch = _.dispatch( 

        StateManagementStrategy.prototype.toggle,

        StateManagementStrategy.prototype.mapTileHoverToCloseByLocations,

        StateManagementStrategy.prototype.hoveredLocation,

        StateManagementStrategy.prototype.detailsLocation,

        StateManagementStrategy.prototype.panels

    );

    return StateManagementStrategy;

});
