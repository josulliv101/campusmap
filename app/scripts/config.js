
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

            },

            pageurl: window.location.origin + window.location.pathname

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

                , primarylabel: null

                , detailsnavbar: [{ id: 'details', label: 'Details', classes: '' }, { id: 'depts-offices', label: 'Departments & Offices' }, { id: 'imagery', label: 'Imagery' }]
                              
            }

        },

        labels: {

            primary: 'Search the %campus% campus'

        },

        throwError: {

            appInit: function() { throw new Error('Error initializing App.'); },

            appControllerInit: function() { throw new Error('Error initializing AppController.'); },

            mapViewInit: function() { throw new Error('Error initializing Map View.'); },

            strategyCreation: function() { throw new Error('Strategy requires an id and type'); }
            
        },

        googlemap: {

            attrs: function(api) {

                return {

                    navigationControl: true,

                    navigationControlOptions: {

                        style: api.maps.NavigationControlStyle.SMALL
                        
                    },

                    panControl: false,

                    zoomControl: false,

                    mapTypeControl: false,

                    streetViewControl: true,

                    streetViewControlOptions: {

                        position: api.maps.ControlPosition.RIGHT_BOTTOM

                    }                

                };

            },

            maptypes: {

                plain: {

                    styles: [{

                            'elementType': 'labels',
                            'stylers': [{
                                'visibility': 'off'
                            }]

                        }, {
                            'featureType': 'road',
                            'stylers': [{
                                'visibility': 'on'
                            }]
                        },

                        {
                            "featureType": "road.local",
                            "elementType": "geometry.stroke",
                            "stylers": [{
                                "weight": 0.4
                            }]
                        },

                        {
                            "featureType": "road",
                            "elementType": "labels.text",
                            "stylers": [{
                                "visibility": "on"
                            }, {
                                "lightness": 46
                            }]
                        },

                        {
                            "featureType": "road.local",
                            "elementType": "labels.text",
                            "stylers": [{
                                "visibility": "on"
                            }, {
                                "lightness": 20
                            }]
                        },

                        {
                            "featureType": "administrative.land_parcel",
                            "stylers": [{
                                "visibility": "off"
                            }]
                        },

                        {
                            "stylers": [{
                                "saturation": -33
                            }, { "invert_lightness": false } ]
                        },

                        {
                            "featureType": "poi.park",
                            "elementType": "geometry",
                            "stylers": [{
                                "gamma": 0.80
                            }]
                        },

                        {
                            "stylers": [{
                                "gamma": 0.94
                            }]
                        },

                        {
                            "featureType": "poi.school",
                            "elementType": "geometry",
                            "stylers": [{
                                "gamma": 0.90
                            }]
                        },

                        {
                            "featureType": "road.local",
                            "elementType": "labels.text.stroke",
                            "stylers": [{
                            "visibility": "off"
                            }]
                        }

                    ] // plain

                },

                sketch: {

                    tiles: function(api) {

                        return new api.maps.ImageMapType({

                            getTileUrl: function(coord, zoom) {

                                return "http://d.tiles.mapbox.com/v3/examples.a4c252ab/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
                            
                            },

                            tileSize: new google.maps.Size(256, 256),

                            name: "Sketch",

                            maxZoom: 18

                        });

                    }

                },

                pinterest: {

                    tiles: function(api) {

                        return new api.maps.ImageMapType({

                            getTileUrl: function(coord, zoom) {

                                return "https://a.tiles.mapbox.com/v3/pinterest.map-ho21rkos/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
                            
                            },

                            tileSize: new google.maps.Size(256, 256),

                            name: "Pinterest",

                            maxZoom: 18

                        });

                    }

                }

            }

        }

    };

});