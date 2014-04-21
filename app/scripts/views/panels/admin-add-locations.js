define([

    'jquery'

    , 'underscore'

    , 'scripts/views/panels/Base'

    , 'datastore'

    , 'eventdispatcher'

], function($, _, Base, Datastore, EventDispatcher) {

    'use strict';

    return Base.extend({

        events: {

            'click .btn-save': 'save'
        },

        initialize: function() {

         _.bindAll(this, 'handleMapClick');

            Base.prototype.initialize.call(this);

            this.newLocations = [];

            EventDispatcher.on('delegateTruth', function(changedAttrs, previousAttrs) { 

                this.model.set({ 

                    map: changedAttrs.campusmap || this.model.get('map')

                });

            }, this);

        },

        handleMapClick: function(latlng) {

            var loc = {

                locationid: _.uniqueId('Location'),

                name: 'New Location',

                latlng: latlng,

                mapid: _.getAttr(this.model.get('map'), 'mapid')

            };

            // Avoid dups
            if (!_.find(this.newLocations, function(model) { return model.latlng === latlng; })) this.newLocations.push(loc);

            EventDispatcher.trigger('truthupdate', { locationsadded: _.map(this.newLocations, function(l){ return l.latlng; }).join('|') });

            this.model.set({ locationsaddedcount: this.newLocations.length });

            this.render();

        },

        save: function(ev) {

            var map = this.model.get('map');

            ev.preventDefault();

            _.each(this.newLocations, function(attrs) {

                var loc = new Datastore.Location(attrs);

                loc.save()

                .then(function() {

                    if (!map.has('locations')) map.set('locations', []);

                    map.get('locations').push(loc);

                    map.save();

                });

            });

        },

        handleOpenState: function() {

            if (this.model.get('state') !== 'open') return;

            this.init = true;

            this.model.set({ locationsaddedcount: 0 });

            this.render();

            this.stopListening(EventDispatcher, 'mapdblclick');

            this.listenTo(EventDispatcher, 'mapdblclick', this.handleMapClick);

        },

        handleCloseState: function() {
                    
            if (this.model.get('state') !== 'close') return;

            this.stopListening(EventDispatcher, 'mapdblclick');

            EventDispatcher.trigger('truthupdate', { locationsadded: null });

            this.newLocations = [];

        }
    });
});