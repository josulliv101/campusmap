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

                var href, 

                    to = this.model.get('directionsto'), 

                    ll = _.getAttr(to, 'latlng'), 

                    from = (this.$el.find('#input-addr1').val() || '') + ' ' + this.$el.find('#input-city').val() + ' ' + this.$el.find('#input-state').val();

                if (_.isEmpty(this.$el.find('#input-city').val())) return this.$el.find('.msg').html('Please enter a city.');

                href = "http://www.google.com/maps/dir/" + ll.lat + "," + ll.lng + "/" + from.replace(" ", "+");

                this.$el.find('#googlemap-link').attr("href", href);

                // Needs to have inner el
                this.$el.find('#googlemap-link span').trigger("click");

            }
        },

        initialize: function() {

            Base.prototype.initialize.call(this);

            this.model.set({ directionsto: { name: ''} });

            EventDispatcher.on('delegateTruth', function(changedAttrs, previousAttrs) { 

                this.model.set({ 

                    directionsto: changedAttrs.directionsto || this.model.get('directionsto')

                });

            }, this);

        },

        toJSON: function() {

            var directionsto = this.model.get('directionsto'), json = Base.prototype.toJSON.call(this);

            json.model.directionsto = directionsto.toJSON ? directionsto.toJSON() : directionsto;

            return json;

        }
    });
});