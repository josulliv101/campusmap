
define([

  '../scripts/controllers/appController'

], function (AppController) {

  describe('App Controller Tests', function () {

    var controller;

    beforeEach(function() {

      spyOn(AppController.prototype, 'setTheTruth').andCallThrough();

      spyOn(AppController.prototype, 'trigger').andCallThrough();

      spyOn(AppController.prototype, 'transformRawTruthChange').andCallThrough();


/*
      spyOn(AppController.prototype, 'init');

      spyOn(AppController.prototype, 'getData');

      spyOn(AppController.prototype, 'handleTruthChange');

      // Return a fake router with some fake settings 
      spyOn(AppController.prototype, 'startRouter').andReturn({ settings: { campusid: 'grafton', vizpath: 'googlemap' }});

*/

      controller = new AppController({}, {}, {});
      
    });

    afterEach(function(){

        controller = null;

    });

    describe('Basic', function () {

      it('should throw an error if required passed-in args not present', function () {

        expect( function() { 

          var ac = new AppController({}, {}); // Missing 3rd arg (router)

        }).toThrow();

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

      it('handles any changes to the Truth by clearing, transforming and setting the Truth.', function () {

        controller.init();

        controller.trigger('truthupdate', { fakeAttr: true });

        expect( AppController.prototype.transformRawTruthChange ).toHaveBeenCalled();

        expect( AppController.prototype.setTheTruth ).toHaveBeenCalled();

      });

      it('clears the Truth', function () {

        controller.init();

        // Set the Truth
        controller.trigger('truthupdate', { fakeAttr: true });

        controller.clearTruth();

debugger;

      });

/*
      it('should have a getData method', function () {

        expect( AppController.prototype.getData ).toBeDefined();

      });

      it('should have a startRouter method', function () {

        expect( AppController.prototype.startRouter ).toBeDefined();

      });
*/
    });

  });

});
