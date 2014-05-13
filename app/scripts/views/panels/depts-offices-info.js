define([

    'jquery'

    , 'underscore'

    , 'scripts/views/panels/Base'

    , 'eventdispatcher'

], function($, _, Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        events: {

            'click .btn-directions': function(ev) {

            }
        },

        initialize: function() {

            Base.prototype.initialize.call(this);

            this.model.set({ occupant: {} });

            EventDispatcher.on('delegateTruth', function(changedAttrs, previousAttrs) { 

                if (!changedAttrs.occupant) return;

                this.model.set({ occupant: changedAttrs.occupant });

                this.render();

            }, this);

        },

        toJSON: function() {

            var json = this.model.get('occupant');

            json.phone && (json.phone = this.formatPhone(json.phone));

            return { model: json };

        }

    });
});