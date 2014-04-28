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

                    //_.delay(function(model) {

                        EventDispatcher.trigger('truthupdate', {  panels: 'details,back-to-results', details: locid });
//backto: { searchboxdisable: model.get('searchboxdisable'), panels: 'results', label: 'back to list', primarylabel: model.get('primarylabel') } 
                    //}, 400, this.model);
                    

               } else {

                    this.$('.active').removeClass('active');

                    $li.addClass('active');

                }/* */
            }
        },

        initialize: function() {

            var titlesByMode;

            Base.prototype.initialize.call(this);

            titlesByMode = {  

                building: 'All Buildings (results)',

                parking: 'Parking (results)',

                commencement: 'Commencement (results)',

                accessibility: 'Accessibility (results)',

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

                console.log('results panel', this.state());

                //if (this.state() === 'open') return this.render();

                // Helps when input captured during a animation
                if (this.state() === 'close') return PanelManager.openPanels([ this ]);

                this.render();

            }, this);

        },

        getResults: function() {

            var model = this.model, locations = model.get('locations'), q = model.get('query'),

                // Convert models to json
                results = Filter.filter(q, locations, Filter.getFilter(model.get('filter')));
//.first(5)

            model.set({ results: results });

            // Let the panel re-render via Base's pre open call
            //if (this.state() === 'open') this.render();

        },

        handleOpenPreState: function(model, state) {

            var label, mode, titlesByMode;

            if (state !== 'openPre') return;

            label = this.model.get('primarylabel');

            mode = this.model.get('mode');

            titlesByMode = this.model.get('titles');

            titlesByMode[mode] = label;

            // Remember the primarylabel for the current mode. Used with back to list links.
            this.model.set('titles', titlesByMode);
            
            this.render();
            
            return state;

        },

        // Make sure there's always a location obj
        toJSON: function() {

            var query = this.model.get('query'), json = Base.prototype.toJSON.call(this);

            json.model.results = _.chain(json.model.results)

                                  .map(function(loc) { return loc.toJSON ? loc.toJSON() : loc; })

                                  .sortBy('name')

                                  // Highlight letters matching query
                                  .each(function(result) {

                                    var expr = "(^|[ -/]+)(" + query + ")";

                                    if (_.isEmpty(result.name)) return;

                                    // Only replace first match - insensitive to case
                                    result.name = result.name.replace(new RegExp(expr, "i"), "$1<em>$2</em>");

                                  })

                                  .value();
            
            return json;

        }
    });
});