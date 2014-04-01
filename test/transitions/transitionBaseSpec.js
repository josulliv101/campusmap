
define([

  'jquery',

  'eventdispatcher',

  '../../../app/scripts/transitions/transitionBase'

], function ($, EventDispatcher, Transition) {

  describe('Transition Base Tests', function () {

    var view, model, transition = new Transition();


    beforeEach(function() {

      view = new FakeView();

      view.model = new FakeModel();

      spyOn(Transition.prototype, 'animateDomOpen_').andCallFake(function() {

        Transition.prototype.openPost_.call(transition, view);

      });

      spyOn(Transition.prototype, 'animateDomClose_').andCallFake(function() {

        Transition.prototype.closePost_.call(transition, view);

      });

    });

    afterEach(function(){

        model = null;

        view = null;

    });

    describe('Basics', function () {

      it('should exist', function () {

        expect( Transition.prototype ).toBeDefined();

      });

      it('should have all the required functions', function () {

        expect( Transition.prototype.openPre_ ).toBeDefined();
        expect( Transition.prototype.open ).toBeDefined();
        expect( Transition.prototype.openPost_ ).toBeDefined();
        expect( Transition.prototype.closePre_ ).toBeDefined();
        expect( Transition.prototype.close ).toBeDefined();
        expect( Transition.prototype.closePost_ ).toBeDefined();

        expect( Transition.prototype.animateDomOpen_ ).toBeDefined();
        expect( Transition.prototype.animateDomClose_ ).toBeDefined();

        expect( Transition.prototype.isOpen_ ).toBeDefined();
        expect( Transition.prototype.isClosed_ ).toBeDefined();

      });
  
    });

    describe('The Open Functions', function () {

      it('should check if the model is already in the open state', function () {

        spyOn(Transition.prototype, 'isOpen_').andCallThrough();

        // Stop action here
        spyOn(Transition.prototype, 'doAnimationOpen_');

        Transition.prototype.open.call(transition, view);

        expect( Transition.prototype.isOpen_ ).toHaveBeenCalled();

      });

      it('should return if the model state is already open', function () {

        spyOn(Transition.prototype, 'openPre_').andCallThrough();

        // Stop action here
        spyOn(Transition.prototype, 'doAnimationOpen_');

        view.model.state = 'open';

        Transition.prototype.open.call(transition, view);

        expect( Transition.prototype.openPre_ ).not.toHaveBeenCalled();

      });

      it('should call openPre if not already open', function () {

        spyOn(Transition.prototype, 'openPre_').andCallThrough();

        // Stop action here
        spyOn(Transition.prototype, 'doAnimationOpen_');

        Transition.prototype.open.call(transition, view);

        expect( Transition.prototype.openPre_ ).toHaveBeenCalled();

        expect( view.model.state ).toBe('openPre');

      });

      it('should call doAnimationOpen_', function () {

        spyOn(Transition.prototype, 'doAnimationOpen_');

        Transition.prototype.open.call(transition, view);

        expect( Transition.prototype.doAnimationOpen_ ).toHaveBeenCalled();

      });

      it('should call openPost if not already open', function () {

        spyOn(Transition.prototype, 'openPost_');

        Transition.prototype.open.call(transition, view);

        expect( Transition.prototype.openPost_ ).toHaveBeenCalled();

        //expect( view.model.state ).toBe('openPre');

      });
  
    });

    describe('The Close Functions', function () {

      it('should return a deferred object', function () {

        // Stop action here
        spyOn(Transition.prototype, 'isClosed_');

        var ret = Transition.prototype.close.call(transition, view);

        expect( ret.promise ).toBeDefined();

      });

      it('should check if the model is already in the close state', function () {

        // Stop action here
        spyOn(Transition.prototype, 'isClosed_');

        Transition.prototype.close.call(transition, view);

        expect( Transition.prototype.isClosed_ ).toHaveBeenCalled();

      });

      it('should return if the model state is already closed', function () {

        spyOn(Transition.prototype, 'closePre_');

        view.model.state = 'close';

        Transition.prototype.close.call(transition, view);

        expect( Transition.prototype.closePre_ ).not.toHaveBeenCalled();

      });

      it('should call closePre if not already closed', function () {

        spyOn(Transition.prototype, 'closePre_').andCallThrough();

        // Stop action here
        spyOn(Transition.prototype, 'doAnimationClose_');

        Transition.prototype.close.call(transition, view);

        expect( Transition.prototype.closePre_ ).toHaveBeenCalled();

        expect( view.model.state ).toBe('closePre');

      });

      it('should call doAnimationClose_', function () {

        spyOn(Transition.prototype, 'doAnimationClose_');

        Transition.prototype.close.call(transition, view);

        expect( Transition.prototype.doAnimationClose_ ).toHaveBeenCalled();

      });

      it('should call closePost if not already open', function () {

        spyOn(Transition.prototype, 'closePost_');

        Transition.prototype.close.call(transition, view);

        expect( Transition.prototype.closePost_ ).toHaveBeenCalled();

        //expect( view.model.state ).toBe('openPre');

      });

      it('should return a deferred object that gets called after close Transition ends', function () {

        Transition.prototype.close.call(transition, view);

         waitsFor(function () {

          return view.deferred.state() === 'resolved';

        });

        runs(function () {

          expect(view.deferred.state()).toBe('resolved');

        });

      });
  
    });


    describe('Transition', function () {

      it('should not have the "animating" class when not opening/closing', function () {

        // Baseline
        expect( view.$el.hasClass('animating') ).toBe(false);

        // After an open
        Transition.prototype.open.call(transition, view);

        expect( view.$el.hasClass('animating') ).toBe(false);


        // After an open
        Transition.prototype.close.call(transition, view);
        
        expect( view.$el.hasClass('animating') ).toBe(false);

      });

      it('should have the "animating" class while opening', function () {

        // Stop action here
        spyOn(Transition.prototype, 'doAnimationOpen_');

        spyOn(Transition.prototype, 'openPre_').andCallThrough();

        // Baseline
        expect( view.$el.hasClass('animating') ).toBe(false);

        Transition.prototype.open.call(transition, view);

        expect( view.$el.hasClass('animating') ).toBe(true);

        expect( Transition.prototype.openPre_ ).toHaveBeenCalled();

      });

      it('should have the "animating" class while closing', function () {

        // Stop action here
        spyOn(Transition.prototype, 'doAnimationClose_');

        spyOn(Transition.prototype, 'closePre_').andCallThrough();

        // Baseline
        expect( view.$el.hasClass('animating') ).toBe(false);

        Transition.prototype.close.call(transition, view);

        expect( view.$el.hasClass('animating') ).toBe(true);

        expect( Transition.prototype.closePre_ ).toHaveBeenCalled();

      });

      it('should have an "open" state after opening', function () {

        // Baseline
        expect( view.model.get('state')).not.toBe('open');

        Transition.prototype.open.call(transition, view);

        expect( view.model.get('state')).toBe('open');

      });

      it('should have an "close" state after closing', function () {

        // First open it
        Transition.prototype.open.call(transition, view);

        // Baseline
        expect( view.model.get('state')).toBe('open');

        Transition.prototype.close.call(transition, view);

        expect( view.model.get('state')).toBe('close');

      });

      it('should not be able to open when "animating" class is present', function () {

        view.$el.addClass('animating');

        // First open it
        expect( Transition.prototype.open.call(transition, view) ).toBe(false);

      });

      it('should not be able to close when "animating" class is present', function () {

        view.$el.addClass('animating');

        // First open it
        expect( Transition.prototype.close.call(transition, view) ).toBe(false);

      });
  
    });

  });

});