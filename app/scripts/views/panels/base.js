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


        }

    });

    BaseView.path = function(template) { return path + template + '.ejs'}

    return BaseView;

});

