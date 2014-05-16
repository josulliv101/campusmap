define([

    'jquery',

    'underscore',

    'datastore',

    'templates',

    'eventdispatcher',

    '_mixins'

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
                EventDispatcher.trigger('truthupdate', { primarylabel: '', filter: 'defaultFilter' });

            },

            'focusout #searchbox': function(ev) {

                // Set primarylabel to null to show placeholder text if no user entered text in searchbox
                if (_.isEmpty( $(ev.currentTarget).val() )) EventDispatcher.trigger('truthupdate', { primarylabel: null });

            },

            // Update query model on keyup
            'keyup  #searchbox': _.debounce(function(ev) {

                var q = $(ev.currentTarget).val(),

                    args = { panels: (_.isEmpty(q) ? '' : 'results'), filter: 'defaultFilter', query: q, 'show-results-help': true };

                EventDispatcher.trigger('truthupdate', args);

                // Announce keyup event, results panel is listening
                EventDispatcher.trigger('searchbox:keyup', args);

            }, 200),

            // The back To List btn 
            'click  .btn-backto': function(ev) {

                var attrs = this.model.get('backto');

                ev.preventDefault();

                EventDispatcher.trigger('truthupdate', _.extend(attrs, { backto: null }));

            }
        },

        className: 'searchbox',

        template: JST['app/scripts/templates/searchbox.ejs'],

        initialize: function() {

            _.bindAll(this, 'handleTruthChange', 'refreshBackTo', 'refreshSearchboxDisabled', 'refreshPrimaryLabel');

            EventDispatcher.on('delegateTruth', this.handleTruthChange);

            // Text longer than this number is considered long text. Add css flag for it so text font-size can be decresed.
            this.longtxt = 40;

            this.extralongtxt = 50;

            if (this.model) {

                this.listenTo(this.model, 'change:primarylabel', this.refreshPrimaryLabel);

                this.listenTo(this.model, 'change:searchboxdisable', this.refreshSearchboxDisabled);

                this.listenTo(this.model, 'change:query', this.refreshResultsPanel);

                this.listenTo(this.model, 'change:backto', this.refreshBackTo);

                this.listenTo(this.model, 'change:mode', this.refreshModeTitle);

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

        refreshModeTitle: function(model, mode) {

            var label = " ";

            if (mode === 'parking' || mode === 'accessibility' || mode === 'commencement') label = mode;

            $('#mode').html(_.capitaliseFirstLetter(label));

        },

        refreshPrimaryLabel: function(model, label) {

            var classname;

            // Reset
            this.$el.removeClass('longtext extralongtext');

            if (_.isString(label)) {

                classname = label.length > this.extralongtxt ? 'extralongtext' : (label.length > this.longtxt ? 'longtext' : '');
                
                this.$el.addClass(classname);

            }

            this.$('#searchbox, .label-primary').val(label);

        },

        refreshSearchboxDisabled: function(model, isDisabled) {

            this.$('#searchbox').prop('disabled', isDisabled);

        },

        refreshResultsPanel: function(model, query) {

            //EventDispatcher.trigger('truthupdate', { panels: !_.isEmpty(query) ? 'results' : '' }); 
            
        },

        refreshBackTo: function(model, attrs) {

            var classname = 'show-backto',

                $lbl = this.$el.find('.btn-backto .lbl');

            this.$el.removeClass(classname);

            if (_.isEmpty(attrs)) return;

            $lbl.html(attrs.label || 'back');

            // Show the btn
            this.$el.addClass(classname);
            
        },


        handleTruthChange: function(changedAttrs) {

            if (this.model) this.model.set(changedAttrs, { silent: false }); 

        },

        handleBtnClick: function(ev) {

            ev.preventDefault();

            this.$el.focus();

            EventDispatcher.trigger('truthupdate', { panels: '', details: '', backto: null, primarylabel: null, searchboxdisable: false });
            
        }

    });

    SearchboxView.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);

    return SearchboxView;

});
