define([

    'jquery'

    , 'underscore'

    , 'scripts/views/panels/Base'

    , 'eventdispatcher'

], function($, _, Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        title: function() { return this.model.get('location').name; },

        events: {

            'click .panel-details': function(ev) {

                if (ev.target && ev.target.nodeName.toLowerCase() !== 'button') {

                    // Closes any secondary panels that are open
                    EventDispatcher.trigger('truthupdate', { panels : 'details' });

                }

            },
/*
            'mouseover .panel-details': _.once(function(ev) {

                _.delay(this.showHint, 500);

                _.delay(this.hideHint, 20000);

            })
*/
        },

        initialize: function() {

            Base.prototype.initialize.call(this);

            _.bindAll(this, 'hideHint');

            this.location = null;

            EventDispatcher.on('delegateTruth', function(changedAttrs, previousAttrs) { 

                this.model.set({ 

                    navbar: changedAttrs.detailsnavbar || this.model.get('navbar'),

                    navbarstate: changedAttrs.detailsnavbarstate || this.model.get('navbarstate')

                });

                // No need to re-render. The panel is forced close every time so will re-render before opening.
                if (changedAttrs.detailsnavbarstate || changedAttrs.detailsnavbar) this.refresh();

            }, this);

        },

        refresh: function() {

            var navbarprefix = 'bd-active-',

                navModel = this.model.get('navbar'), 

                navbarstate = this.model.get('navbarstate');

            // Select first as default if none specified
            if (_.isEmpty(navbarstate) && navModel.length > 0) navbarstate = _.first(navModel).id;

            _.each(navModel, function(navitem) { 

                var classes = navbarstate === navitem.id ? 'active' : '';

                this.$('#' + navitem.id).removeClass('active').addClass(classes);

            }, this);

            this.$el.removeClass(function() {

                return _.chain($(this).attr('class').split(/\s+/))

                        .reject(function(classname) { return classname.indexOf(navbarprefix) !== 0; })

                        .value()

                        .join(" ");

            });

            this.$el.addClass(navbarprefix + navbarstate);

        },



        // Make sure there's always a location obj
        toJSON: function() {

            var json = Base.prototype.toJSON.call(this),

                navbarstate = json.model.navbarstate,

                loc = json.model.location;

            // Format phone numbers
            loc.phone && (loc.phone = this.formatPhone(loc.phone));

            if (json.model.navbar) {

                _.each(json.model.navbar, function(item) { item.classes = (item.id === navbarstate ? 'active' : ''); });

                // Remove any that have hide true
                json.model.navbar = _.reject(json.model.navbar, function(navitem) { return navitem.hide && navitem.hide === true; });
            
            }

            return json;

        },

        handleOpenPreState: function(model, state) {

            var navbarstate, navbar;

            if (state !== 'openPre') return;

            navbar = model.get('navbar');

            // Reset to first whenever panel opens
            navbarstate = navbar.length > 0 ? _.first(navbar).id : '';

            if (!_.isEmpty(navbarstate)) EventDispatcher.trigger('truthupdate', { detailsnavbarstate: navbarstate });

            return state;

        },

        formatPhone: function(digits) {

            return digits.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

        },

        showHint: function() {

            // Show hint panel about map icons advancing navbar
            EventDispatcher.trigger('truthupdate', { panels : 'details,hint-map-icons' });

        },

        hideHint: function() {

            var panel = this.manager.getPanel('hint-map-icons');

            // Only close if hint panel is still showing
            if (panel.state() === 'open') EventDispatcher.trigger('truthupdate', { panels : 'details' });

        }

    });
});