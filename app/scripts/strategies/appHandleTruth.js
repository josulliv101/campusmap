define([

    'underscore', '_mixins'

], function(_) {

    'use strict';
debugger;
    return {

        id: 'handle-truth-app', 

        type: 'TruthHandler',

        dispatch: _.dispatch(

            // Include tile to the East
            function(MapUtils, tile, zoom) { // Location Model

               // if (model.emphasis > 2 || model.selected === true) return;

               return 9;//MapUtils.getLocationsFromTileCache(tile, zoom);

            }

        )

    };

});
