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

                defaultFilter: [

                    // Filter matching departments & offices
                    function(loc) { 

                        var occupants = _.getAttr(loc, 'occupants'), names;

                        if (!occupants) return false;

                        names =    _.chain(occupants)

                                    .map(function(occupant) { return _.trim(occupant.name); })

                                    .filter(function(name) { 

                                        if ( name.match(new RegExp("(^| )" + query_.term, "ig")) ) return true;

                                    })

                                    .value();

                        if (names.length > 0) {

                            _.setAttr(loc, { resultMatch: { val: names.join(", "), attr: "dept-offices", word: "test" } });

                            return true;

                        }; 

                        return false;

                    }, 'tags', 'keywords', 'address1', 'name'] 

            },

        // Cache the created function for access later
            getFilterFnForAttr_ = _.memoize(

                function(attr) {

                    return function(loc) { 
                        
                        var val, words;

                        val = _.getAttr(loc, attr) && _.getAttr(loc, attr).toLowerCase();

                        if (!val) return false;

                        words = _.chain(val.split(' ')).reject(function(word) { return _.contains(['and','an', 'at', 'for'], word); }).value();

                        // Check if the query term contains a space
                        if (query_.term.indexOf(" ") > 0) {

                            if ( val.match(new RegExp("(^| )" + query_.term, "ig")) ) {

                                _.setAttr(loc, { resultMatch: { val: _.getAttr(loc, attr), attr: attr  } });

                                return true;

                            }
                        }

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
            query_.term = q && _.trim(q.toLowerCase());

            fns = filterParamsToFns_(filters);

            // Reset the results match text
            _.each(locations, function(loc) { _.setAttr(loc, { resultMatch: null }); });

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
