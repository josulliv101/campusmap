define([

    'underscore'

    , 'config'

    , 'scripts/domManager'

    , 'eventdispatcher'

    , '_mixins'

], function(_, Config, DomManager, EventDispatcher) {

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

        _.each(all, function(loc) { _.setAttr(loc, { isCloseBy: (_.contains(closeby, loc)) }); });

        console.log('closeby locs', closeby.length);

        EventDispatcher.trigger('truthupdate', { locationscloseby: closeby });

        return  val;

    };

    StateManagementStrategy.prototype.detailsLocation = function(model, val, key, MapUtils) {

        var all, navbar;

        if (key !== 'details') return;

        all = model.get('locations');

        _.each(all, function(loc) { _.setAttr(loc, { isDetails: (val && _.getAttr(val, 'locationid') ? _.getAttr(loc, 'locationid') === _.getAttr(val, 'locationid') : false) }); });

        navbar = _.chain(Config.models.detailsnavbar)

                          // Reset
                          .each(function(navitem) { navitem.hide = false; })

                          // Determine which items should be displayed, and update model
                          .each(function(navitem) {

                                if (_.isObject(val) && navitem.id === 'imagery') {

                                    navitem.hide = _.isEmpty(_.getAttr(val, 'imageurl'));

                                }

                                if (_.isObject(val) && navitem.id === 'depts-offices') {

                                    navitem.hide = _.isEmpty(_.getAttr(val, 'occupants'));

                                }

                          })

                          .value();

        // Do silently?
        EventDispatcher.trigger('truthupdate', _.extend({ 

            forceclosepanels: true

            //, panels: _.isObject(val) ? 'details' : ''

            , detailsnavbar: navbar

        }, _.isObject(val) ? {  primarylabel: _.getAttr(val, 'name'), searchboxdisable: true }  : {}));

//panels: 'details',
        // Hack to get the navbar state to be correct on first display
        EventDispatcher.trigger('delegateTruth', { detailsnavbar: navbar });

        console.info('detailsLocation', val);

        return  val;

    };

    StateManagementStrategy.prototype.hoveredLocation = function(model, val, key, MapUtils) {

        var all;

        if (key !== 'hover') return;

        all = model.get('locations');

        _.each(all, function(loc) { _.setAttr(loc, { isHovered: (val && _.getAttr(val, 'locationid') ? _.getAttr(loc, 'locationid') === _.getAttr(val, 'locationid') : false) }); });

        // Change the cursor to the pointer when hovering over a label
        EventDispatcher.trigger('truthupdate', { cursor: val && !_.isEmpty(val) ? 'pointer' : '' });

        return  val;

    };


    StateManagementStrategy.prototype.panels = function(model, val, key, MapUtils) {

        if (key !== 'panels') return;

        EventDispatcher.trigger('truthupdate', { 'searchbox-open': !_.isEmpty(val) });

        return  val;

    };

    StateManagementStrategy.prototype.forceClosePanels = function(model, val, key, MapUtils) {

        if (key !== 'forceclosepanels') return;

        // Reset
        if (val === true) EventDispatcher.trigger('truthupdate', { forceclosepanels: false }, { silent: true });

        return  val;

    };

    StateManagementStrategy.prototype.panelTransitionDone = function(model, val, key, MapUtils) {

        if (key !== 'paneltransitiondone') return;

        // Reset
        if (val === true) {

            EventDispatcher.trigger('truthupdate', { paneltransitiondone: null }, { silent: true });

        }

        return  val;

    };


    StateManagementStrategy.prototype.dispatch = _.dispatch( 

        StateManagementStrategy.prototype.toggle,

        StateManagementStrategy.prototype.mapTileHoverToCloseByLocations,

        StateManagementStrategy.prototype.hoveredLocation,

        StateManagementStrategy.prototype.detailsLocation,

        StateManagementStrategy.prototype.panels,

        StateManagementStrategy.prototype.forceClosePanels,

        StateManagementStrategy.prototype.panelTransitionDone

    );

    return StateManagementStrategy;

});
