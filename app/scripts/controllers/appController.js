define([

    'underscore'

    , 'backbone'

    , 'eventdispatcher'

], function(_, Backbone, EventDispatcher) {

    'use strict';

    //// Private ////
    
    var Config, Datastore, DomManager, Router;

    // using
    _, Datastore;

    function AppController(config, domManager, router) {

        // Config, DomManager & Router passed-in instead of injected dependencies for easier overriding of methods in testing.
        if (!config || !domManager || !router) throw new Error('Error initializing AppController.');

        Config = config;

        DomManager = domManager;

        Router = router;

        _.bindAll(this, 'handleTruthChange', 'setTheTruth',  'transformRawTruthChange'); // , 'dispatchVizTruth', 'dispatchTruth' , 


        //_.extend(this, options);

        // An empty model -- no attri butes yet
        this.theTruth = new Backbone.Model(); //Datastore.Factory.model();

        //this.router = Router.init();

        //console.log('Datastore this', Datastore);

    }

    AppController.prototype.init = function() {

        var theTruth = this.theTruth;

        //var handlers = new AppControllerEventHandlers(AppController, this);

        //this.attrChangeDispatch  = _.dispatch.apply(this, handlers.getHandlers());

        AppController.prototype.handleTruthChange = _.compose(

                this.clearTruth

            );


        //// Add App-level Event Listeners ////

        // Incoming Truth changes
        theTruth.listenTo(EventDispatcher, 'truthupdate', _.compose(

            this.setTheTruth,

            this.transformRawTruthChange,

            this.clearTruth

        ));

        // Handling of Truth changes
        //EventDispatcher.listenTo(theTruth, 'change', this.handleTruthChange);

        return this;

    };

    AppController.prototype.setTheTruth = function(changedAttrs, options) {

        var theTruth = this.theTruth;

        options || (options =  {});

        if (arguments.length === 2) changedAttrs = _.toArray(changedAttrs);

        // Gets cleared when router handles route -- needed for Back Button integration.
        //if (options.clear === true) theTruth.clear({ silent: true });

        //this.validateTheTruth(changedAttrs);
        
        //this.transformRawTruthChange(changedAttrs);

        // Forward on params. Handy for { silent: true } option
        theTruth.set.apply(theTruth, changedAttrs);

        return changedAttrs;

    };

    // Always use 'set' to update the model's truth. This ensures that the changedAttributes method is always accurate.
    AppController.prototype.handleTruthChange = function() {};

    AppController.prototype.clearTruth = function(changedAttrs, options) { 

        options || (options = {});

        if (options.clear === true) this.theTruth.clear({ silent: true }); 

        return [changedAttrs, options];

    };

    // Makes testing a bit easier to having AppController be able to dispatch events too
    AppController.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);

    AppController.prototype.transformRawTruthChange = function(changedAttrs, options) {

        options || (options =  {});

        if (arguments.length === 2) changedAttrs = _.toArray(changedAttrs);

        return changedAttrs;

    };

    return AppController;

});