define([

    'jquery',

    'underscore',

    'templates',

    'datastore',

    'eventdispatcher'

], function($, _, JST, Datastore, EventDispatcher) {

    'use strict';


    var BaseView, path = 'app/scripts/templates/panels/';


    BaseView = Datastore.View.extend({

        title: '',

        initialize: function() {

            var model = this.model;

            _.bindAll(this, 'render', 'getTitle', 'handleStateChange', 'handleOpenState', 'handleCloseState', 'handleOpenPreState', 'handleClosePreState');

            if (!model) return;

            // Path to the template -- maps to panels folder
            this.template = JST[BaseView.path(this.id)];

            model.set({ state: 'close', location: {} }, { silent: true });

            this.$el.addClass('panel');

            this.handleStateChange = _.dispatch(this.handleOpenState, this.handleCloseState, this.handleOpenPreState, this.handleClosePreState);

            this.listenTo(model, 'change:state', this.handleStateChange);

            // Every panel will know when a location changes
            EventDispatcher.on('delegateTruth', function(changedAttrs, previousAttrs) { 

                if (!changedAttrs.details) return;

                this.location = changedAttrs.details || {};

                this.model.set({ location: this.location.toJSON ? this.location.toJSON() : this.location });

            }, this);

        },

        close: function(transition, index) {

            transition || (transition = {});

            // Only close open panels
            if (this.state() !== 'open') return;

            // Let the deferred object be undefined if no close method.
            return _.isFunction(transition.close) ? transition.close(this, index) : this.model.set({ state: 'close' });

        },

        open: function(transition) {

            transition || (transition = {});

            // Only open closed panels
            if (this.state() !== 'close') return;

            this.render();
            
            // Let the deferred object be undefined if no close method.
            return _.isFunction(transition.open) ? transition.open(this) : this.model.set({ state: 'open' });

        },

        handleStateChange: function(model, state) {},

        handleOpenPreState: function(model, state) {

            if (state !== 'openPre') return;
            
            return state;

        },

        handleClosePreState: function(model, state) {

            if (state !== 'closePre') return;
            
            return state;

        },

        handleOpenState: function(model, state) {

            if (state !== 'open') return;

            return state;

        },

        handleCloseState: function(model, state) {

            if (state !== 'close') return;
            
            return state;

        },

        toJSON: function() {

            // Having data attr makes tesing for undefined easier in templates
            return { model: this.model.toJSON() };

        },

        state: function() { return this.model.get('state'); },

        render: function() {

            var json = this.toJSON();

            if (!this.template) return this;

            this.$el.html(this.template(json));

            return this;

        },

        getTitle: function() {

            return _.isFunction(this.title) ? this.title() : title;

        }

    });

    BaseView.path = function(template) { return path + template + '.ejs'; };

    return BaseView;

});

