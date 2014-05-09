define([

    'jquery',

    'underscore',

    'eventdispatcher'

], function($, _, EventDispatcher) {

    'use strict';

    function TransitionBase() {}


    // Returns a deferred object promise
    TransitionBase.prototype.animateDomOpen_ = function(view) {

        view.$el.css({ overflow: 'hidden', top: '0px' }); // top: '-50px'

        return view.$el.fadeIn(450);

    };

    // Returns a deferred object promise
    TransitionBase.prototype.animateDomClose_ = function(view) {

        view.$el.css('overflow', 'hidden');

        return view.$el.fadeOut(150);

    };

    TransitionBase.prototype.doAnimationOpen_ = function(view) {

        var openFn = this.openPost_;

        view.model.set('state', 'doingAnimation');

        var dfd = this.animateDomOpen_(view);

        $.when(dfd)

        .then(function() {

            openFn(view);

            if (view.deferred) view.deferred.resolve( 'animation complete' );

        });

    };

    TransitionBase.prototype.doAnimationClose_ = function(view) {

        var closeFn = this.closePost_;

        view.model.set('state', 'doingAnimation');

        $.when(this.animateDomClose_(view))

        .then(function() {

            closeFn(view);

            if (view.deferred) view.deferred.resolve( 'animation complete' );

        });

    };
    
    TransitionBase.prototype.openPre_ = function(view) {

        view.model.set('state', 'openPre');

        this.doAnimationOpen_(view);

    };

    // Stub -- defined in constructor so this keyword behaves when unit testing
    TransitionBase.prototype.open = function(view, position) {

        if (!view || !view.model) return;

        if (_.exists(position)) view.$el.css('z-index', 999-(position || 0));

        if (this.isOpen_(view)) return;

        if (view.$el.hasClass('animating')) {

          return false; 

        } 

        if (view.$el) view.$el.addClass('animating');

        // Needs to be created before triggering openPre_
        view.deferred = new $.Deferred();

        this.openPre_(view);

        return view.deferred.promise(); 

    };

    TransitionBase.prototype.openPost_ = function(view) {

        view.model.set('state', 'openPost');

        view.model.set('state', 'open');

        if (view.$el) view.$el.removeClass('animating state-closed');

        view.$el.addClass('state-opened');

    };

    TransitionBase.prototype.closePre_ = function(view) {

        view.model.set('state', 'closePre');
        
        this.doAnimationClose_(view);

    };

    TransitionBase.prototype.close = function(view) {

        if (!view || !view.model) return;

        if (this.isClosed_(view)) return;

        if (view.$el.hasClass('animating')) {

          return false; 

        } 

        if (view.$el) view.$el.addClass('animating');

        // Needs to be created before triggering closePre
        view.deferred = new $.Deferred();

        this.closePre_(view);

        return view.deferred.promise(); 

    };

    TransitionBase.prototype.closePost_ = function(view) {

        view.model.set('state', 'closePost');

        view.model.set('state', 'close');

        if (view.$el) view.$el.removeClass('animating state-opened');

        if (view.$el) view.$el.css({ display: 'none' });

        view.$el.addClass('state-closed');

    };

    TransitionBase.prototype.isOpen_ = function(view) {

        return view.model.get('state') === 'open';

    };

    TransitionBase.prototype.isClosed_ = function(view) {

        return view.model.get('state') === 'close';

    };

    return TransitionBase;

});