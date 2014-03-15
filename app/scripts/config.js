
define([

], function() {

    'use strict';

    var icon_base = 'app/images/icons/';

    return {

        env: {

            paths: {

                base: '/',

                icons: {

                    base: icon_base,

                    map: icon_base + 'map/'
                },

                data: {

                    jsonp: './app/data/data.json'

                }

            }

        },

        defaults: {

            theTruth: {

                cmd: ''

                , iconstrategy: 'default'

                , labelstrategy: 'default'

                , mapcenteroffset: 'default'

                , maptype: 'plain'

                , panelanimations: false

                , parking: false

                , accessibility: false

                //, largelabels: false

                //, resize: null

                , primarylabel: ''
                              
            }

        },

        throwError: {

            appInit: function() { throw new Error('Error initializing App.'); },

            appControllerInit: function() { throw new Error('Error initializing AppController.'); },

            strategyCreation: function() { throw new Error('Strategy requires an id and type'); }
            
        }

    };

});
