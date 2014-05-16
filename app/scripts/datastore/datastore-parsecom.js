
define([

    'jquery',

    'underscore',

    'backbone',

    'datainterface',

    'parsecom'

], function($, _, Backbone, DataInterface, Parse) {

    'use strict';

    console.info('Datastore Parse.com');

    // Tufts Account
    Parse.initialize("nfmwDYABTXjDPTOmfBvz89Fe3i7Sv8lp426R2Fzu", "2wMHizUh1Y73nMjmHDIdIJVMd7aUPI7V4r1eUSTh");

    //// Private ////

    var campuses_ = new Parse.Collection(),

        maps_ = new Parse.Collection(),

        fns_ = DataInterface.initialize(campuses_, maps_),

        classLocation_ = Parse.Object.extend({className: "Location"});


    // Wrap the Parse.com in a jquery deferred obj for consistency
    function fetch_(campusid) {
 
        var dfd = $.Deferred(), query;
        
        query = new Parse.Query('Campus')

        .equalTo("campusid", campusid)
        
        // Include nested object data in instead of just pointers to object ids
        .include('maps', 'maps.locations')
        
        .find({
            
            success: function(list) {

                var campus, map, locations, defaults;

                campuses_.add(list, { silent: true });

                campus = campuses_.at(0);

                map = campus.get('maps')[0];

                locations = _.getAttr(map, 'locations'); 

                dfd.resolve({ 

                    campus: campus,

                    campusmap: map,

                    locations: locations,

                    center: map.get('latlng'),

                    zoom: map.get('zoom')

                });

            },
            
            error: function() {
                
                alert('error');
                
                dfd.reject( 'error' );
                
            }
            
        });
                    
        return dfd.promise();           
                    
    }

    function model_(options) {

        return new Backbone.Model(options);

    }

    //// Public ////

    return _.extend(fns_, { 

        fetch: fetch_, 

        Location: classLocation_,

        Model: Backbone.Model, 

        Collection: Backbone.Collection, 

        View: Backbone.View,

        factory: { model: model_ }

    });

});
