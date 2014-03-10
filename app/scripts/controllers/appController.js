define([

    'underscore'

    , 'backbone'

    , 'eventdispatcher'

], function(_, Backbone, EventDispatcher) {

    'use strict';

    // using
    _;

    function AppController(datastore) {

        _.bindAll(this, 'handleTruthChange', 'setTheTruth',  'transformRawTruthChange'); // , 'dispatchVizTruth', 'dispatchTruth' , 

        this.datastore = datastore;

        //_.extend(this, options);

        // An empty model -- no attributes yet
        this.theTruth = new Backbone.Model(); //Datastore.Factory.model();

        //this.router = Router.init();

        //console.log('Datastore this', Datastore);

    }

    AppController.prototype.init = function() {

        var theTruth = this.theTruth;

        //var handlers = new AppControllerEventHandlers(AppController, this);

        //this.attrChangeDispatch  = _.dispatch.apply(this, handlers.getHandlers());

        //// Add App-level Event Listeners ////

        // Incoming Truth changes
        theTruth.listenTo(EventDispatcher, 'truthupdate', this.setTheTruth);

        // Handling of Truth changes, then Truth delegation to Component-level controllers
        EventDispatcher.listenTo(theTruth, 'change', this.handleTruthChange);

        return this;

    };

    // Always use 'set' to update the model's truth. This ensures that the changedAttributes method is always accurate.
    AppController.prototype.setTheTruth = function(changedAttrs, options) {

        options || (options =  {});

        // Gets cleared when router handles route -- needed for Back Button integration.
        if (options.clear === true) this.theTruth.clear({ silent: true });
        
        // Preprocess changed attributes -- acts as insertion point for attr tweaks
        changedAttrs = this.transformRawTruthChange(changedAttrs);

        // Forward on params. Handy for { silent: true } option
        this.theTruth.set(changedAttrs, options);

    };

    AppController.prototype.handleTruthChange = function(model) { 

        var changed = model.changedAttributes(),
        
            previous = model.previousAttributes();

        // Nothings changed, cancel
        if (_.isEmpty(changed)) return;

        // Handle each changed attribute in the most appropriate manner, determined by dispatch function
        _.each(changed, function(val, key) { 

            val; key; //this.attrChangeDispatch(model, val, key); 

        }, this);

        // The Truth changes get sent to Component-level controllers for further handling
        EventDispatcher.trigger('delegateTruth', changed, previous);

        // Have router listen and do query string updates

    };

    AppController.prototype.transformRawTruthChange = function(changedAttrs) {

        return changedAttrs;

    };

    AppController.prototype.getData = function() {

        return this.datastore.fetch();

    }

    AppController.prototype.startRouter = function(settings) {

        // Ensure there's a campus & campusmap selected
        Datastore.campus();

        Datastore.map();

        this.router.settings = settings;

        Router.start();

        return this.router;

    }

    // Makes testing a bit easier to having AppController be able to dispatch events too
    AppController.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);

    return AppController;

});