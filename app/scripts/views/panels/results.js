define([

    'jquery'

    , 'underscore'

    , 'scripts/views/panels/Base'

    , 'scripts/filter'

    , 'eventdispatcher'

], function($, _, Base, Filter, EventDispatcher) {

    'use strict';

    return Base.extend({

        events: {
            'focusin .list .result button' : function(ev) {
                var locid =  $(ev.currentTarget).data('locationid');
                console.log('mouseover', locid);
                EventDispatcher.trigger('truthupdate', { hover: locid });
            },
            'mouseover .list .result button' : function(ev) {
                var locid =  $(ev.currentTarget).data('locationid');
                console.log('mouseover', locid);
                EventDispatcher.trigger('truthupdate', { hover: locid });
            },
            'mouseout .list .result button' : function(ev) {
                console.log('mouseout');
                EventDispatcher.trigger('truthupdate', { hover: null });
            }
        },

        initialize: function() {

            Base.prototype.initialize.call(this);

            this.model.set({ results: [] });

            EventDispatcher.on('delegateTruth', function(changedAttrs, previousAttrs) { 

                this.model.set({ 

                    query: changedAttrs.query || this.model.get('query'),

                    locations: changedAttrs.locations || this.model.get('locations')

                });

                // No need to re-render. The panel is forced close every time so will re-render before opening.
                if (changedAttrs.query) this.getResults();

            }, this);

        },

        getResults: function() {

            var model = this.model, locations = model.get('locations'), q = model.get('query'),

                results = Filter.filter(q, locations, 'name');

            model.set({ results: _.sortBy(results, 'name') });

            this.render();

        },

        // Make sure there's always a location obj
        toJSON: function() {

            var json = Base.prototype.toJSON.call(this);

            return json;

        }
    });
});