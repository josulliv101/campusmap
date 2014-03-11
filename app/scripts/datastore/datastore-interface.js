define([

    'underscore'

    //, '_mixins'

    //, 'backbone'

    //, 'strategies/StrategyManager'

    //'eventdispatcher'

], function(_) {

    'use strict';

    return {

        initialize: function(campusList) {

            var campusList_ = campusList;

            // Return the functions that make up the interface
            return {

                // All campuses as a <Collection>
                getCampusList: function() { return campusList_; },

                // Get the first campus
                getCampus: _.bind(function() { return _.first(this); }, campusList.models),

                // Expect implementing Object to override this function
                fetch: function() { return campusList; }

            };

        }

    };

});
