
define([

    'jquery'

    , 'underscore'

    , 'scripts/config'

    , 'scripts/controllers/appController'

    , 'scripts/controllers/mapController'

    , 'scripts/controllers/searchboxController'

    , 'scripts/router'

    , 'datastore'

    , 'scripts/domManager'

    , 'scripts/panelManager'

], function($, _, Config, AppController, MapController, SearchboxController, Router, Datastore, DomManager, PanelManager) {


    'use strict';


    function App(el, settings, defaults, mapView) {

        _.bindAll(this, 'start');

        // A root DOM element is required
        el && el.nodeType ? DomManager.setAppRoot(el) : Config.throwError.appInit();

        // The settings eventually turn into the Truth
        this.settings = _.defaults(settings, defaults);

        this.controller = new AppController().init();

        this.mapController = new MapController(mapView);

        this.searchboxController = new SearchboxController(PanelManager);

    }
    
    // A manual init call makes for nice insertion point for spies when testing
    App.prototype.init = function() {

        // A campus id is required
        if (!this.settings.campus) return;

        // Grab the data, then begin.
        $.when( this.fetch(this.settings.campus) )

            .done(this.start)

            .fail(Config.throwError.appInit);

        return this;
        
    };

    App.prototype.start = function(data) {

        // The truth is born (almost) -- app config settings, passed-in settings, and settings from fetched data all are now combined.
        //var settings = _.defaults(this.settings, data);
        var settings = _.extend(this.settings, data);

        // Parse route and add attributes to settings
        new Router( { settings: settings } ).start();

    };

    App.prototype.fetch = _.bind(Datastore.fetch, Datastore); // Nice to have when testing

    return App;

});
