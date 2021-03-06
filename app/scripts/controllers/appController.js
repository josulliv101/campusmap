define([

    'underscore'

    , 'backbone'

    , 'datastore'

    , 'scripts/domManager'

    , 'scripts/panelManager'

    , 'scripts/utils/MapUtils'

    , 'strategies/CssFlagStrategy'

    , 'strategies/DataTypeStrategy'

    , 'strategies/StateManagementStrategy'

    , 'eventdispatcher'

], function(_, Backbone, Datastore, DomManager, PanelManager, MapUtils, CssFlagStrategy, DataTypeStrategy, StateManagementStrategy, EventDispatcher) {

    'use strict';


    function AppController() {

        _.bindAll(this, 'handleTruthChange', 'setTheTruth'); 

        // An empty model -- no attributes yet
        this.theTruth = Datastore.factory.model();

        this.cssFlagStrategy = new CssFlagStrategy();

        this.dataTypeStrategy = new DataTypeStrategy();

        this.stateManagementStrategy = new StateManagementStrategy();

    }

    // Add App-level Event Listeners
    AppController.prototype.init = function() {

        // Incoming Truth changes
        this.theTruth.listenTo(EventDispatcher, 'truthupdate', this.setTheTruth);

        // Handling of Truth changes, then Truth delegation to Component-level controllers
        EventDispatcher.listenTo(this.theTruth, 'change', this.handleTruthChange);

        return this;

    };

    // Always use 'set' to update the model's truth. This ensures that the changedAttributes method is always accurate.
    AppController.prototype.setTheTruth = function(changedAttrs, options) {

        options || (options =  {});

        // Gets cleared when router handles route -- needed for Back Button integration.
        if (options.clear === true) this.theTruth.clear({ silent: true });

        // Preprocess changed attributes -- acts as insertion point for attr tweaks
        _.each(changedAttrs, function(val, key) { 

            // Update DOM with appropriate css flags -- on root element of app
            this.dataTypeStrategy.dispatch(changedAttrs, val, key, Datastore, PanelManager, DomManager, this.theTruth);

        }, this);

        // Forward on params. Handy for { silent: true } option
        this.theTruth.set(changedAttrs, options);

    };

    AppController.prototype.handleTruthChange = function(model) { 

        var changed = model.changedAttributes(),
        
            previous = model.previousAttributes();

        // Nothings changed, cancel
        if (_.isEmpty(changed)) return;

        // Pretend the panels attr changed -- forceclosepanels will be reset by the state strategy
        if (changed.forceclosepanels === true) changed.panels = model.get('panels');

        // Handle each changed attribute in the most appropriate manner, determined by dispatch function
        _.each(changed, function(val, key) { 

            // First, make sure any data model related changes happen
            this.stateManagementStrategy.dispatch(model, val, key, MapUtils);

            // Update DOM with appropriate css flags -- on root element of app
            this.cssFlagStrategy.dispatch(model, val, key);

        }, this);

        // The Truth changes get sent to Component-level controllers for further handling
        EventDispatcher.trigger('delegateTruth', changed, previous);

        // Have router listen and do query string updates

    };

    // Makes testing a bit easier to having AppController be able to dispatch events too
    AppController.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);


    return AppController;

});