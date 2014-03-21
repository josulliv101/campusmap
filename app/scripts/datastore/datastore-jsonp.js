/*global define*/

define([

    'jquery'

    , 'underscore'

    , 'backbone'

    , 'scripts/config'

    , 'datainterface'

], function($, _, Backbone,  Config, DataInterface) {

    'use strict';


    //// Private ////

    var fns_, campuses_, maps_;


    campuses_ = new Backbone.Collection();

    maps_ = new Backbone.Collection();


    fns_ = DataInterface.initialize(campuses_);

    campuses_.url = Config.env.paths.data.jsonp;
    

    function fetch_() {

        var dfd = $.Deferred();

        // Only want defaults settings returned, not all data. use custom deferred instead of the fetch's return value
        campuses_.fetch({ 

            jsonpCallback: 'cb',  

            dataType: 'jsonp',

            cache: true,

            success: function(campuses, data) {

                var campus = campuses.at(2),

                    map = campus.get('maps')[0],

                    locations = map.locations;

                dfd.resolve({ 

                    campus: campus.toJSON(),

                    campusmap: map,

                    locations: locations

                });

            },

            error: function() {
                
                dfd.reject( 'error' );
                
            }
            
        });

        return dfd.promise();
        
    }

    function model_(options) {

        return new Backbone.Model(options);

    }


    //// Public ////

    return _.extend(fns_, { fetch: fetch_, Model: Backbone.Model, Collection: Backbone.Collection, View: Backbone.View, factory: { model: model_ } });

});
