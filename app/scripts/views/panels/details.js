define([

    'scripts/views/panels/Base'

    , 'eventdispatcher'

], function(Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        events: {

            'click .navbar button': function(ev) {
//debugger;
                //EventDispatcher.trigger('truthupdate', { detailsnavbar : $(ev.currentTarget) });

            }

        },

        initialize: function() {

            Base.prototype.initialize.call(this);

            this.location = null;

            EventDispatcher.on('delegateTruth', function(changedAttrs, previousAttrs) { 

                var location;

                this.location = changedAttrs.details || {};

                console.log('**************', changedAttrs, previousAttrs);

                this.model.set({ 

                    location: this.location.toJSON ? this.location.toJSON() : this.location,

                    navbar: changedAttrs.detailsnavbar || this.model.get('navbar'),

                    navbarstate: changedAttrs.detailsnavbarstate || this.model.get('navbarstate')

                });

                // No need to re-render. The panel is forced close every time so will re-render before opening.
                if (changedAttrs.detailsnavbarstate) this.refresh();

            }, this);

        },

        refresh: function() {

            var navbarprefix = 'bd-active-',

                navModel = this.model.get('navbar'), 

                navbarstate = this.model.get('navbarstate');

            // Select first as default if none specified
            if (_.isEmpty(navbarstate)) navbarstate = _.first(navModel).id;

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

                // SHortcut to loc json
                jsonLoc = json.model.location || (json.model.location = {}),

                navbarstate = json.model.navbarstate;

            // Format phone numbers
            jsonLoc.phone && (jsonLoc.phone = this.formatPhone(jsonLoc.phone));

            if (json.model.navbar) {

                _.each(json.model.navbar, function(item) { item.classes = (item.id === navbarstate ? 'active' : '') })
            
            }

            return json;

        },

        handleOpenPreState: function(model, state) {

            var navbarstate;

            if (state !== 'openPre') return;
            
            // Reset to first whenever panel opens
            navbarstate = _.first(model.get('navbar')).id;

            EventDispatcher.trigger('truthupdate', { detailsnavbarstate: navbarstate });

            return state;

        },

        formatPhone: function(digits) {

            return digits.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

        }

    });
});