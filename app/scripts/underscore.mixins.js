
define([

    'underscore'

], function(_) {

    'use strict';

    _.mixin({

        compactObject: function(o) {

            _.each(o, function(v, k) {

                if (!v) delete o[k];

            });

            return o;
        },

        exists: function(x) {

            return x != null;

        },

        truthy: function(x) {

            return (x !== false) && _.exists(x);

        },

        cat: function() {

            var head = _.first(arguments);

            if (_.exists(head)) {

                return head.concat.apply(head, _.rest(arguments));

            } 

            else return [];

        },

        construct: function(head, tail) {

            return _.cat([head], _.toArray(tail));

        },

        dispatch: function( /* functions */ ) {

            var fns = _.toArray(arguments),

                len = fns.length;

            return function(target /*, args */ ) {

                var ret, fn, i = 0,

                    args = _.rest(arguments);

                for (i; i < len; i++) {

                    fn = fns[i];

                    ret = fn.apply(fn, _.construct(target, args));

                    // Return the first one that returns a valid value
                    if (_.exists(ret)) return ret;
                }

                return ret;

            };
        },

        stringToObject: function(txt, delimitPairs, delimitKeyVal) {

            var delimPairs = delimitPairs || '|',

                delimKeyVal = delimitKeyVal || ':';

            return _.chain(txt.split(delimPairs))

                    .map(function(pair) { return pair.split(delimKeyVal); })

                    .object()

                    .value();

        },

        // Useful for dealing with models or object literals
        getAttr: function(item, attr) {

            // Avoid changing latlng strings into objects, use this as a work-around. Helps with parse.com saving.
            if (attr == 'latlng' && item.latlngObj)  return item.latlngObj;

            return item.attributes && item.attributes[attr] || item[attr];

        },

        setAttr: function(item, attrs, options) {

            return item.attributes && item.set(attrs, options) || _.extend(item, attrs);

        },

        // Get next item in array, or first if at end
        getNext: function(arr, item) {

            var curIndex, nextItem;

            //if (_.isEmpty(arr)) return;

            // Convert string id to object
            if (_.isString(item)) {

                item = _.chain(arr).find(function(itm) { return itm.id === item; }).value();

            }

            // Get current index of passed-in item
            if (_.isObject(item)) {

                curIndex = _.indexOf(arr, item);

            } 

            // If no item, return first
            if (_.isEmpty(item)) return _.first(arr);

            // If last item passed in, retun first
            if (curIndex === arr.length - 1) return _.first(arr);
            
            // return next item
            return arr[++curIndex];

        }

    });

    return _;

});
