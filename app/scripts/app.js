
define([

    'jquery'

    , 'underscore'

    , 'scripts/config'

    , 'scripts/controllers/appController'

    , 'scripts/controllers/mapController'

    , 'scripts/router'

    , 'datastore'

    , 'scripts/domManager'

], function($, _, Config, AppController, MapController, Router, Datastore, DomManager) {


    'use strict';


    function App(el, settings, defaults, mapView) {

        _.bindAll(this, 'start');

        // A root DOM element is required
        el && el.nodeType ? DomManager.setAppRoot(el) : Config.throwError.appInit();

        // The settings eventually turn into the Truth
        this.settings = _.defaults(settings, defaults);

        this.controller = new AppController().init();

        this.mapController = new MapController(mapView);

    }
    
    // A manual init call makes for nice insertion point for spies when testing
    App.prototype.init = function() {

        // Grab the data, then begin.
        $.when( this.fetch() )

            .done(this.start)

            .fail(Config.throwError.appInit);

        return this;
        
    };

    App.prototype.start = function(data) {

        // The truth is born (almost) -- app config settings, passed-in settings, and settings from fetched data all are now combined.
        var settings = _.defaults(this.settings, data);

        // Parse route and add attributes to settings
        new Router( { settings: settings } ).start();

    };

    App.prototype.fetch = _.bind(Datastore.fetch, Datastore); // Nice to have when testing

    return App;

});
