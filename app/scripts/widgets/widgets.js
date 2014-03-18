
define([

    'underscore'

    , 'datastore'

    , 'app'

], function(_, Datastore, App) {

    'use strict';

    if (require === undefined) return;

    function campusmap_(appDom, mapDom, settings) {

        require(['scripts/views/map/GoogleMap'], function (GoogleMapView) {

            var mapView = new GoogleMapView({ el: mapDom, model: Datastore.factory.model() });

        });

    }
 
    return {

        Campusmap: campusmap_

    };

});
