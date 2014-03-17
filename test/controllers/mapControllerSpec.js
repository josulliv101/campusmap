
define([
  
  '../../scripts/controllers/mapController'

], function (MapController) {

  describe('Map Controller Tests', function () {

    var controller;

    beforeEach(function() {

      spyOn(MapController.prototype, 'handleTruthChange').andCallThrough();

      controller = new MapController();
      
    });

    afterEach(function(){

        controller = null;

    });

    describe('Functions', function () {

      it('handles updates to the Truth', function () {

        controller.trigger('delegateTruth', { myattr: 123 }, { myattr: 321 });

        expect( MapController.prototype.handleTruthChange ).toHaveBeenCalledWith({ myattr: 123 }, { myattr: 321 });

      });

    });

  });

});
