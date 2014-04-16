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
            },
            'click .list .result button' : function(ev) {

                var $li =  $(ev.currentTarget).closest('.result'),

                    locid =  $(ev.currentTarget).data('locationid');

                if (!locid) return;

                if ($li.hasClass('active')) {

                    EventDispatcher.trigger('truthupdate', { panels: 'details', details: locid, backto: { panels: 'results', details: '', label: 'back to results', primarylabel: this.model.get('query') } });

                } else {
                    this.$('.active').removeClass('active');
                    $li.addClass('active');
                }
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

                // Convert models to json
                results = Filter.filter(q, locations, 'name');

            model.set({ results: _.sortBy(results, 'name') });

            this.render();

        },

        // Make sure there's always a location obj
        toJSON: function() {

            var query = this.model.get('query'), json = Base.prototype.toJSON.call(this);

            json.model.results = _.chain(json.model.results)

                                  .map(function(loc) { return loc.toJSON ? loc.toJSON() : loc; })

                                  // Highlight letters matching query
                                  .each(function(result) {

                                    var expr = "(" + query + ")";

                                    if (_.isEmpty(result.name)) return;

                                    // Only replace first match - insensitive to case
                                    result.name = result.name.replace(new RegExp(expr, "ig"), "<em>$1</em>");

                                  })

                                  .value();
            
            return json;

        }
    });
});