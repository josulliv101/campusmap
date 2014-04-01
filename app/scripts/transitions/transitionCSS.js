define([

    'jquery',

    'scripts/transitions/transitionBase'

], function($, Base) {

    'use strict';

    function TransitionCSS() {}

    TransitionCSS.prototype = new Base();

    TransitionCSS.prototype.constructor = TransitionCSS;  

    TransitionCSS.prototype.animateDomOpen_ = function(view) {

        var dfd = $.Deferred();

        view.$el.one('webkitAnimationEnd oAnimationEnd msAnimationEnd animationend', function(e) {

            // 'one' function will only remove the 1 event triggered, 3 others will remain and need to be removed
            view.$el.unbind('webkitAnimationEnd oAnimationEnd msAnimationEnd animationend');

            view.$el.removeClass('show');

            view.$el.addClass('css3');

            dfd.resolve();

        }); 

        view.$el.show();

        view.$el.addClass('show');

        return dfd.promise();

    };

    TransitionCSS.prototype.animateDomClose_ = function(view) {

        var dfd = $.Deferred();

        view.$el.one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function(e) {

            view.$el.removeClass('hide');

            dfd.resolve();

        });

        view.$el.addClass('hide');

        return dfd.promise() ;

    };

    return TransitionCSS;

});