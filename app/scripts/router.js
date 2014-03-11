/*global define*/
define([

    'underscore'

    , 'backbone'

    , 'eventdispatcher'

], function(_, Backbone, EventDispatcher) {

    'use strict';

    // Using
    _; EventDispatcher;

    var AppRouter = Backbone.Router.extend({

        defaults: {

            settings: {},

            whiteList: [],

            locWhiteList: ['details', 'campusmap', 'campusid']

        },

        routes: {

            // Default
            '*params': 'handleRoute'

        },

        initialize: function(options) {

            _.extend(this, this.defaults, options);

        },

        start: function(options) {

            Backbone.history.start(options);

        },

        processQueryString: function(qs) {

            if (_.isString(qs)) {

                qs = decodeURIComponent(qs);

                qs = qs.replace(/[^a-zA-Z0-9-+_&=#,!\.:/|]/g, '');

            }

            qs = qs || '';

            // If not key/value pairs, assume it's a campus id
            if (qs.length > 0 && qs.indexOf('=') === -1 && qs.indexOf('&') === -1) {

                qs = 'campusid=' + qs;

            }

            console.log('qs', qs);

            return qs;

        },

        toQueryString: function(truth) {

            return  _.chain(truth)

                     .pick(this.whiteList)

                     // Watch XSS/urlencode
                     .map(function(val, key) { return key + '=' + (_.isObject(val) && val.value ? encodeURIComponent(val.value) : encodeURIComponent(val)); })

                     .value().join('&');

        },

        toLocationQueryString: function(truth) {

            return  _.chain(truth)

                     .pick(this.locWhiteList)

                     // Watch XSS/urlencode
                     .map(function(val, key) { return key + '=' + (_.isObject(val) && val.value ? encodeURIComponent(val.value) : encodeURIComponent(val)); })

                     .value().join('&');

        },

        getDefaults: function(qs) {

            var defaults;

            qs = this.processQueryString(qs);

            if (qs.indexOf('=') === -1) return {};

            defaults = _.chain(qs.split('&'))

                        .map(function(pair) {

                            return pair.split('=');

                        })

                        .each(function(arr) {

                            // Convert Booleans
                            if (arr[1] === 'true') arr[1] = true;

                            else if (arr[1] === 'false') arr[1] = false;

                            // Convert string to Number
                            else if (arr[1].match(/^\d+$/) !== null) arr[1] = parseInt(arr[1]);

                        })

                        .object()

                        .value();

            return defaults;

        },

        handleRoute: function(q) {
            
            var initialTruth = _.extend(this.settings, this.getDefaults(q));

            // Start handling the Truth
            EventDispatcher.trigger('truthupdate', initialTruth, { clear: false });

        }

    });

    return AppRouter;

});
