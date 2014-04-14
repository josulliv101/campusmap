define([

    'jquery',

    'underscore',

    'datastore',

    'templates',

    'eventdispatcher'

], function($, _, Datastore, JST, EventDispatcher) {

    'use strict';

    var SearchboxView = Datastore.View.extend({

        events: {

            'click .btn.search': 'handleBtnClick',

            // For cases where a map icon/label is under the searchbox, unhighlight it
            'mouseover #container-searchbox': function() {

                EventDispatcher.trigger('truthupdate', { hover: null });

            }

        },

        className: 'searchbox',

        template: JST['app/scripts/templates/searchbox.ejs'],

        initialize: function() {

            _.bindAll(this, 'handleTruthChange');

            EventDispatcher.on('delegateTruth', this.handleTruthChange);

            if (this.model) this.listenTo(this.model, 'change:primarylabel', this.refreshPrimaryLabel);

            // Don't use event delegation here to avoid issue where focus event fires in an unexpected way
            this.$el.on('focus', '#searchbox', function(e) {

                e.preventDefault();

            });

            return this;
        },

        render: function() {

            var json = { model: this.model.toJSON() },

            html = this.template(json);

            this.$el.append(html);

            return this;

        },

        refreshPrimaryLabel: function(model, label) {

            this.$('#searchbox, .label-primary').val(label);

            // Disable input when location is shown (shows more appropriate cursor)
            this.$('#searchbox').prop('disabled', !_.isEmpty(model.get('details')));
            
        },

        handleTruthChange: function(changedAttrs) {

            if (this.model) this.model.set(changedAttrs, { silent: false }); 

        },

        //// Event Handling ////

        handleBtnClick: function(ev) {

            ev.preventDefault();

            this.$el.focus();

            EventDispatcher.trigger('truthupdate', { panels: '', details: '' });
            
        }

    });

    SearchboxView.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);

    return SearchboxView;

});
