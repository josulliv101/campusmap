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
// to be deleted
                    locations = map.locations; //[{"name":"Ballou Hall","id":"m029","locationid":"m029","panoramas":[{"type":"photo","heading":200,"latlng":"42.407795,-71.119896","pitch":20,"zoom":1,"photo":"./app/images/streetview/ballouhall-1.png"},{"type":"photo","heading":95,"latlng":"42.407411,-71.120771","pitch":20,"zoom":1,"photo":"./app/images/streetview/ballouhall-2.png"},{"type":"photo","heading":20,"latlng":"42.407054,-71.120411","pitch":20,"zoom":1,"photo":"./app/images/streetview/ballouhall-3.png"},{"type":"photo","heading":60,"latlng":"42.407043,-71.120878","pitch":20,"zoom":1,"photo":"./app/images/streetview/ballouhall-4.png"},{"heading":300,"latlng":"42.407201,-71.120881","panoid":"M77AaZ5uueTV-s_-Npbbbg","pitch":15,"zoom":1}, {"heading":50,"latlng":"42.40742,-71.12046","pitch":10,"zoom":1},{"heading":60,"latlng":"42.40724,-71.11981","pitch":15,"zoom":1}],"thumbnail":"ballouhall-th.png","urlphoto":"ballouhall.png","label-position":"top","address1":"1 The Green","emphasis":2,"mapid":"medford-main","state":"MA","country":"United States","latlng":"42.407435,-71.120122"}];

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
