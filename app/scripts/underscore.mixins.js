
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

        }

    });

    return _;

});
