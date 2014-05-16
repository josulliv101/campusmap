define([

    'jquery'

    , 'underscore'

    , 'scripts/views/panels/Base'

    , 'scripts/filter'

    , 'eventdispatcher'

], function($, _, Base, Filter, EventDispatcher) {

    'use strict';

    return Base.extend({

        title: function(mode) { 

            var titlesByMode = this.model.get('titles');

            mode || (mode = this.model.get('mode'));

            return titlesByMode[mode] || 'No title found'; 

        },

        events: {

            'focusin .list .result button' : function(ev) {

                var locid =  $(ev.currentTarget).data('locationid');

                EventDispatcher.trigger('truthupdate', { hover: locid });

            },
/* Removed for now for better performance on hovers
            'mouseover .list .result button' : function(ev) {

                var locid =  $(ev.currentTarget).data('locationid');

                EventDispatcher.trigger('truthupdate', { hover: locid });

            },

            'mouseout .list .result button' : function(ev) {

                EventDispatcher.trigger('truthupdate', { hover: null });

            },*/

            'click .list .result button' : function(ev) {

                var $li =  $(ev.currentTarget).closest('.result'),

                    locid =  $(ev.currentTarget).data('locationid');

                if (!locid) return;

                if ($li.hasClass('active')) {

                    EventDispatcher.trigger('truthupdate', { details: locid, panels: 'details' });// ,back-to-results

               } else {

                    this.$('.active').removeClass('active');

                    $li.addClass('active');

                    // Supress forcing the shut the results panel
                    EventDispatcher.trigger('truthupdate', { details: locid, suppressforceclose: _.uniqueId('suppressforceclose_') });

                }
            }
        },

        initialize: function() {

            var titlesByMode;

            Base.prototype.initialize.call(this);

            titlesByMode = {  

                building: 'All Buildings (results)',

                parking: 'Parking (results)',

                commencement: 'Commencement (results)',

                accessibility: 'Accessibility (results)'

            };

            this.model.set({ results: [], titles: titlesByMode });

            EventDispatcher.on('delegateTruth', function(changedAttrs, previousAttrs) { 

                this.model.set({ 

                    query: changedAttrs.query || this.model.get('query'),

                    locations: changedAttrs.locations || this.model.get('locations'),

                    primarylabel: changedAttrs.primarylabel || this.model.get('primarylabel'),

                    searchboxdisable: changedAttrs.searchboxdisable || this.model.get('searchboxdisable'),

                    filter: changedAttrs.filter || this.model.get('filter'),

                    mode: changedAttrs.mode || this.model.get('mode')

                });

                // No need to re-render. The panel is forced close every time so will re-render before opening.
                if (changedAttrs.query) this.getResults();

            }, this);

            EventDispatcher.on('searchbox:keyup', function() {

                var PanelManager = this.manager;

                if (!PanelManager) return;

                // Helps when input captured during a animation
                if (this.state() === 'close') return PanelManager.openPanels([ this ]);

                this.render();

            }, this);

        },

        getResults: function() {

            var model = this.model, locations = model.get('locations'), q = model.get('query'),

                // Convert models to json
                results = Filter.filter(q, locations, Filter.getFilter(model.get('filter')));

            model.set({ results: _.map(results, function(loc) { return _.isFunction(loc.toJSON) ? loc.toJSON() : loc; }) });

        },

        handleOpenPreState: function(model, state) {

            var label, mode, titlesByMode;

            if (state !== 'openPre') return;

            label = this.model.get('primarylabel');

            mode = this.model.get('mode');

            titlesByMode = this.model.get('titles');

            titlesByMode[mode] = label;
            
            this.render();

            return state;

        },

        // Make sure there's always a location obj
        toJSON: function() {

            var query = this.model.get('query'), json = Base.prototype.toJSON.call(this);

            json.model.results = _.chain(json.model.results)

                                  .map(function(loc) { return loc.toJSON ? loc.toJSON() : loc; })

                                  .sortBy('name')

                                  .each(function(result) { 

                                    if (!result.resultMatch || result.resultMatch.attr === 'name') return result.label = result.name;

                                    if (result.resultMatch.attr === 'dept-offices' || result.resultMatch.attr === 'address1' || result.resultMatch.attr === 'keywords') return result.label = result.name + " <span>(" + result.resultMatch.val + ")</span>";

                                    if (result.resultMatch.attr === 'tags') {

                                        var label = _.chain(result.resultMatch.val.split(","))

                                                     .map(function(tag) { return _.trim(tag); })

                                                     .sortBy()

                                                     .filter(function(tag) { return tag.toLowerCase().indexOf(query.toLowerCase()) === 0 || tag.toLowerCase().indexOf(" " + query.toLowerCase()) > 0; })

                                                     .value()

                                                     .join(", ");

                                        return result.label = result.name + "<span>(" + label + ")</span>";

                                    }

                                   })

                                  // Highlight letters matching query
                                  .each(function(result) {

                                    var expr = "(^|[ -/ ]+)(" + query + ")";

                                    if (_.isEmpty(result.label)) return;

                                    // Only replace first match - insensitive to case
                                    result.label = result.label.replace(new RegExp(expr, "ig"), "$1<em>$2</em>");

                                  })

                                  .value();
            return json;

        }
    });
});