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


        },

        className: 'searchbox',

        template: JST['app/scripts/templates/searchbox.ejs'],

        initialize: function() {

            _.bindAll(this, 'handleTruthChange');

            EventDispatcher.on('delegateTruth', this.handleTruthChange);

            if (this.model) this.listenTo(this.model, 'change:primarylabel', this.render);

        },

        render: function() {

            var json = { model: this.model.toJSON() },

            html = this.template(json);

            this.$el.append(html);

            return this;

        },

        handleTruthChange: function(changedAttrs) {

            if (this.model) {

                this.model.set(changedAttrs, { silent: false }); 

            }   

        }

    });

    SearchboxView.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);

    return SearchboxView;

});
