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

                console.log('directions');

            }
        }
    });
});