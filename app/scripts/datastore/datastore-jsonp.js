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

                //maps_.add(DataInterface.utils.createMapList(campuses_), { silent: true });

                // Using
                campuses; data;

                dfd.resolve({ deferred: 'defaults go here' });

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

    return _.extend(fns_, { fetch: fetch_, factory: { model: model_ } });

});
