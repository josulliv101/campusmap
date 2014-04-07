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

                if (!changedAttrs.details) return;

                this.location = changedAttrs.details || {};

                console.log('**************', changedAttrs, previousAttrs);

                this.model.set({ 

                    location: this.location.toJSON ? this.location.toJSON() : this.location

                });

                // No need to re-render. The panel is forced close every time so will re-render before opening.
                //this.render();

            }, this);

            EventDispatcher.on('delegateTruth', function(changedAttrs, previousAttrs) { 

                if (!changedAttrs.detailsnavbar) return;

                this.model.set({ 

                    detailsnavbar: changedAttrs.detailsnavbar

                });

                this.render();

            }, this);
        },

        // Make sure there's always a location obj
        toJSON: function() {

            var json = Base.prototype.toJSON.call(this),

                // SHortcut to loc json
                jsonLoc = json.model.location || (json.model.location = {});

            // Format phone numbers
            jsonLoc.phone && (jsonLoc.phone = this.formatPhone(jsonLoc.phone));

            return json;

        },

        formatPhone: function(digits) {

            return digits.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

        }

    });
});