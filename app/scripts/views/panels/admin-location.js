define([

    'jquery'

    , 'underscore'

    , 'scripts/views/panels/Base'

    , 'eventdispatcher'

    , '_mixins' // Methods added to _ object

], function($, _, Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        events: {
            
            'click .btn-save': 'save'

        },

        initialize: function() {

            Base.prototype.initialize.call(this);

            EventDispatcher.on('delegateTruth', function(changedAttrs, previousAttrs) { 

                this.model.set({ 

                    locationmodel: changedAttrs.details || this.model.get('locationmodel'),

                    map: changedAttrs.campusmap || this.model.get('map')

                });

            }, this);

            EventDispatcher.on('delegateTruth', function(changedAttrs, previousAttrs) { 

                var latlng;

                if (!changedAttrs.adminmarker) return;

                latlng = changedAttrs.adminmarker;

                this.$el.find('#inputLatLng').val(latlng.lat + ',' + latlng.lng);

            }, this);

        },

        save: function(ev) {

            var location = this.model.get('locationmodel'), 

                map = this.model.get('map'), 

                omitKeys = ['classnames', 'dimensions', 'isDetails', 'isHovered', 'offsetx', 'offsety', 'tileCache'],

                inputObj, attrsAll;

            ev.preventDefault();

            if (!location || !map) return;

            inputObj = _.extend(this.getInput(), { mapid: _.getAttr(map, 'mapid') });

            attrsAll = _.clone(location.attributes);

            // Make sure the persisting fns exist. may be pointing to jsonp datastore and not parse.com datastore
            if (!location || !location.set || !location.save) return;

            _.each(omitKeys, function(key) {

                location.set(key, null, { silent: true });

            });

            location.save(inputObj)

                    .then(function() {

                        location.set(attrsAll, { silent: true });

                    });

        },

        getInput: function() {

            return _.compactObject({

                locationid: _.escape(this.$el.find('#inputId').val()),

                name: _.escape(this.$el.find('#inputName').val()),

                nameshort: _.escape(this.$el.find('#inputNameShort').val()),

                latlng: _.escape(this.$el.find('#inputLatLng').val()),

                emphasis: _.escape(this.$el.find('#inputEmphasis').val()),

                labelplacement: _.escape(this.$el.find('#inputLabelPlacement').val()),

                address1: _.escape(this.$el.find('#inputAddress1').val()),

                address2: _.escape(this.$el.find('#inputAddress2').val()),

                city: _.escape(this.$el.find('#inputCity').val()),

                zip: _.escape(this.$el.find('#inputZip').val()),

                state: _.escape(this.$el.find('#inputState').val()),

                country: _.escape(this.$el.find('#inputCountry').val()),

                website: _.escape(this.$el.find('#inputWebsite').val()),

                phone: _.escape(this.$el.find('#inputPhone').val()),

                imageurl: _.escape(this.$el.find('#inputImage').val()),

                mapid: _.escape(this.$el.find('#inputMapId').val()),

                isvisible: _.escape(this.$el.find('#inputIsVisible').val()),

                tags: _.escape(this.$el.find('#inputTags').val())

            });
        },

        toJSON: function() {

            var json = Base.prototype.toJSON.call(this),

                latlng = json.model.location && json.model.location.latlng;

            if (_.isObject(latlng)) {

                json.model.location.latlng = latlng.lat + ',' + latlng.lng;

            }
            
            return json;

        },

        handleOpenState: function() {

            var state = this.model.get('state'), location = this.model.get('locationmodel');

            if (state !== 'open') return;

            this.init = true;

            if (location) EventDispatcher.trigger('truthupdate', { adminmarker: _.getAttr(location, 'latlng') });

        },

        handleCloseState: function() {

            var state = this.model.get('state');
                    
            if (state !== 'close') return;

            EventDispatcher.trigger('truthupdate', { adminmarker: '' });

        }

    });
});