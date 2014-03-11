
define([

    'jquery'

    , 'underscore'

    , 'scripts/config'

    , 'scripts/controllers/appController'

    , 'scripts/router'

    , 'datastore'

    , 'scripts/domManager'

], function($, _, Config, AppController, Router, Datastore, DomManager) {


    'use strict';


    function App(el, settings, defaults) {

        _.bindAll(this, 'start');

        // A root DOM element is required
        el && el.nodeType ? DomManager.setAppRoot(el) : Config.throwError.appInit();

        // The settings eventually turn into the Truth (the definitive App state)
        this.theSettings = _.defaults(settings, defaults);

        this.controller = new AppController(Datastore);

    }
    
    // A manual init call makes for nice insertion point for spies when testing
    App.prototype.init = function() {

        this.controller.init();

        // Controller has reference to a Data Service module that defines how to fetch data.
        $.when( this.controller.getData() )

            // Kick off the application
            .done(this.start)

            .fail(Config.throwError.appInit);

        return this;
        
    };

    App.prototype.start = function(data) {

        // The truth is born (almost) -- app config settings, passed-in settings, and settings from fetched data all are now combined.
        var settings = _.defaults(this.theSettings, data), 

            router = new Router({ settings: settings });

        // Parse route and add attributes to settings
        router.start();

        // Data may contain some attributes appropriate for settings (i.e. default map)
        //this.controller.startRouter(almostTheTruth);

    };

    return App;

});
