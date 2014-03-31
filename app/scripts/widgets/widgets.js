
define([

    'underscore'

    , 'datastore'

    , 'app'

], function(_, Datastore, App) {

    'use strict';

    if (require === undefined) return;

    function campusmap_(appDom, mapDom, settings) {

        require([

            'scripts/views/map/GoogleMap', 

            'scripts/views/searchbox', 

            'scripts/config'

            ], function (GoogleMapView, SearchboxView, Config) {

            var searchboxView = new SearchboxView({ el: appDom, model: Datastore.factory.model() }).render(),

                mapView = new GoogleMapView({ el: mapDom, model: Datastore.factory.model() }),

                app = new App(appDom, settings, Config.defaults.theTruth, mapView);

            app.init();

        });

    }
 
    return {

        Campusmap: campusmap_

    };

});
