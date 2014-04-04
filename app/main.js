(function () {

   'use strict';

    require.config({

        catchError: true,

        shim: {

            jquery: {

                exports: '$'

            },

            underscore: {

                exports: '_'

            },

            _mixins: {

                deps: ['underscore']
                
            },

            backbone: {

                deps: ['jquery', 'underscore'],

                exports: 'Backbone'

            },
            
            parsecom: {

                deps: ['backbone'],

                exports: 'Parse'

            },

            modernizr: {

                exports: 'Modernizr'

            }
        },

        paths: {

            'jquery': '../bower_components/jquery/jquery',

            'underscore': '../bower_components/lodash/dist/lodash', 
            // lodash/dist/lodash || underscore/underscore

            '_mixins': './scripts/underscore.mixins',

            'app': './scripts/app',

            'transition': './scripts/transitions/transitionCSS',

            'config': './scripts/config',

            'eventdispatcher': './scripts/eventdispatcher',

            'backbone': '../bower_components/backbone/backbone',

            'parsecom': 'http://www.parsecdn.com/js/parse-1.2.9.min',

            'datastore': './scripts/datastore/datastore-parsecom', // datastore-injected datastore-jsonp datastore-parsecom

            'datainterface': './scripts/datastore/datastore-interface',

            'datamodel': './data/data-static',

            'mapstyles': './config-mapstyles',

            'searchpanels': './scripts/views/searchpanels', // A short-cut

            'strategies': './scripts/strategies',

            'googlemap': './scripts/services/map/googlemap',

            'async': '../bower_components/requirejs-plugins/src/async',

            'domReady': '../bower_components/requirejs-domready/domReady',

            'templates': '../.tmp/scripts/templates',

            'modernizr': './scripts/modernizr' // Just a wrapper for Moderizr global object

        }

    });

}());
