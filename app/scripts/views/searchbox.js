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

                //EventDispatcher.trigger('truthupdate', { hover: null });

            },

            // When focused, remove help txt
            'focusin #searchbox': function() {

                // Set val to empty string to clear value in input. Set it to null to show placeholder text.
                EventDispatcher.trigger('truthupdate', { primarylabel: '' });

            },

            'focusout #searchbox': function(ev) {

                // Set primarylabel to null to show placeholder text if no user entered text in searchbox
                if (_.isEmpty( $(ev.currentTarget).val() )) EventDispatcher.trigger('truthupdate', { primarylabel: null });

            },

            // Update query model on keyup
            'keyup  #searchbox': function(ev) {

                EventDispatcher.trigger('truthupdate', { query: $(ev.currentTarget).val() });

            }

        },

        className: 'searchbox',

        template: JST['app/scripts/templates/searchbox.ejs'],

        initialize: function() {

            _.bindAll(this, 'handleTruthChange');

            EventDispatcher.on('delegateTruth', this.handleTruthChange);

            if (this.model) {

                this.listenTo(this.model, 'change:primarylabel', this.refreshPrimaryLabel);

                this.listenTo(this.model, 'change:query', this.refreshResultsPanel);


            }

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

        refreshResultsPanel: function(model, query) {

            console.log('query', query);

            EventDispatcher.trigger('truthupdate', { panels: !_.isEmpty(query) ? 'results' : '' }); 
            
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
