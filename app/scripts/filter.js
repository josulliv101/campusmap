/*
 *  Filter Locations
 *
 *  Get the appropriate locations based on appropriate filters. Filters
 *  include: all, by map, by tag
 *
 */

 define([

    '_mixins'

    ], function(_) {

        'use strict';

        var query_ = { term: '' }, 

            // Canned filters
            filters_ = {

                all: function() { return true; },

                tag_exact: function(loc) {    

                    var tags = _.getAttr(loc, 'tags'), t;

                    if (_.isEmpty(tags)) return;

                    t =   _.chain(tags.split(","))

                             .map(function(tag) { return _.trim(tag); })

                             .filter(function(tag) { return tag.toLowerCase() === query_.term.toLowerCase(); })

                             .value();

                    return !_.isEmpty(t); 

                },

                defaultFilter: ['tags', 'keywords', 'address1', 'name']//function() { return true; }

            },

        // Cache the created function for access later
            getFilterFnForAttr_ = _.memoize(

                function(attr) {

                    return function(loc) { 
                        
                        var val, words;

                        val = _.getAttr(loc, attr) && _.getAttr(loc, attr).toLowerCase();

                        if (!val) return false;

                        words = _.chain(val.split(' ')).reject(function(word) { return _.contains(['and', 'the', 'an', 'at', 'for'], word); }).value();

                        return _.exists(val) && _.some(words, function(word) { 

                            var isMatch = word.indexOf(query_.term) === 0; 

                            if (isMatch === true) _.setAttr(loc, { resultMatch: { val: _.getAttr(loc, attr), attr: attr, word: word } });

                            return isMatch;

                        }); 

                    };

                }

            );

        // Convert filter params (a <String> key) to functions which can actually filter. If function passed in, just return it.
        function filterParamsToFns_(filters) {

            return _.map(filters, function(filterParam) {

                    var filter = filterParam.filter || filterParam;

                    if (_.isFunction(filter)) return filter;

                    // Return the filter matching an attr
                    if (_.isString(filter)) return getFilterFnForAttr_(filter);

                });

        }

        function filter_(q, locations, filters) {

            // Array of filter functions to apply to the locations
            var fns, locs = [];

            if (!_.exists(locations) || !_.isArray(locations) ) return [];

            _.isArray(filters) || (filters = [ filters ]);

            // Update query object term
            query_.term = q && q.toLowerCase();

            fns = filterParamsToFns_(filters);

            // Apply the filters
            _.each(fns, function(fn, index) { locs[index] = _.filter(locations, fn); });

            return _.chain(locs).flatten().uniq().value();

        }


        //// Public ////

        return {

            filter: filter_,

            getQuery: function () { return query_; },

            // See it matches a canned filter.
            getFilter: function(arg) { return filters_[arg] || arg; }

        };

    });
