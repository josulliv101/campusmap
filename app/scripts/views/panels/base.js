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

        initialize: function() {

            var model = this.model;

            _.bindAll(this, 'handleStateChange', 'handleOpenState');

            if (!model) return;

            model.set({ state: 'close' }, { silent: true });

            //EventDispatcher.on('delegateTruth', function(changedAttrs) { this.model });

            this.handleStateChange = _.dispatch(this.handleOpenState, this.handleCloseState, this.handleOpenPreState, this.handleClosePreState);

            this.listenTo(model, 'change:state', this.handleStateChange);

        },

        close: function(transition) {

            transition || (transition = {});

            // Only close open panels
            if (this.state() !== 'open') return;

            // Let the deferred object be undefined if no close method.
            return transition.close ? transition.close(this) : this.model.set({ state: 'close' });

        },

        open: function(transition) {

            transition || (transition = {});

            // Only open closed panels
            if (this.state() !== 'close') return;

            // Let the deferred object be undefined if no close method.
            return transition.open ? transition.open(this) : this.model.set({ state: 'open' });

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
            return { data: this.model.toJSON() };

        },

        state: function() { return this.model.get('state'); }

    });

    BaseView.path = function(template) { return path + template + '.ejs' };

    return BaseView;

});

