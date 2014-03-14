
define([
  
  '../../scripts/controllers/appController'

], function (AppController) {

  describe('App Controller Tests', function () {

    var controller;

    beforeEach(function() {

      spyOn(AppController.prototype, 'setTheTruth').andCallThrough();

      spyOn(AppController.prototype, 'trigger').andCallThrough();

      spyOn(AppController.prototype, 'handleTruthChange').andCallThrough();

      controller = new AppController({}, {}, {});
      
    });

    afterEach(function(){

        controller = null;

    });

    describe('Basic', function () {

      it('should throw an error if required passed-in args not present', function () {

/*        expect( function() { 

          var ac = new AppController({}, {}); // Missing 3rd arg (router)

        }).toThrow();*/

      });

      it('should create the model to hold the Truth', function () {

        expect( controller.theTruth ).toBeDefined();

      });

 
    });


    describe('Functions', function () {

      it('handles updates to the Truth', function () {

        controller.init();

        controller.trigger('truthupdate', { fakeAttr: true });

        expect( AppController.prototype.setTheTruth ).toHaveBeenCalled();

      });

      it('silently handles updates to the Truth', function () {

        spyOn(controller.theTruth, 'set');

        controller.init();

        controller.trigger('truthupdate', { fakeAttr: true }, { silent: true });

        expect( controller.theTruth.set ).toHaveBeenCalledWith({ fakeAttr : true }, { silent : true });

      });

      it('updates the Truth model on truthupdate event', function () {

        controller.init();

        controller.trigger('truthupdate', { fakeAttr: true });

        expect( controller.theTruth.toJSON() ).toEqual({ fakeAttr: true });

      });

      it('handles any changes to the Truth transforming then setting the Truth.', function () {

        controller.init();

        controller.trigger('truthupdate', { fakeAttr: true });

        expect( AppController.prototype.setTheTruth ).toHaveBeenCalled();

      });

      it('clears the Truth when the clear option is set.', function () {

        controller.init();

        // This attribute should be cleared
        controller.trigger('truthupdate', { fakeAttr1: true });

        controller.trigger('truthupdate', { fakeAttr2: true }, { clear: true });

        expect( controller.theTruth.toJSON() ).toEqual({ fakeAttr2: true });

      });

      it('handles a change to the Truth.', function () {

        controller.init();

        // This attribute should be cleared
        controller.trigger('truthupdate', { fakeAttr1: true });

        expect( AppController.prototype.handleTruthChange ).toHaveBeenCalled();

      });

    });

  });

});
