
define([
  
  '../../scripts/controllers/mapController'

], function (MapController) {

  describe('Map Controller Tests', function () {

    var controller;

    beforeEach(function() {

      spyOn(MapController.prototype, 'handleTruthChange').andCallThrough();

      spyOn(MapController.prototype, 'refreshTileCache');

      controller = new MapController(new FakeMapView());
      
    });

    afterEach(function(){

        controller = null;

    });

    describe('Functions', function () {

      it('has a reference to the JSON version of the Truth', function () {

        expect( controller.theTruthJSON ).toBeDefined();

      });

    });

    describe('Functions', function () {

      it('handles updates to the Truth', function () {

        controller.trigger('delegateTruth', { myattr: 123 }, { myattr: 321 });

        expect( MapController.prototype.handleTruthChange ).toHaveBeenCalledWith({ myattr: 123 }, { myattr: 321 });

      });

      it('only refreshes tile cache when zoom or locations change', function () {

        controller.trigger('delegateTruth', { myattr: 123 }, { myattr: 321 });

        expect( MapController.prototype.refreshTileCache ).not.toHaveBeenCalled();

      });

      it('refreshes tile cache when zoom changes', function () {

        controller.trigger('delegateTruth', { zoom: 12 }, { zoom: 11 });

        expect( MapController.prototype.refreshTileCache ).toHaveBeenCalled();

      });

      it('refreshes tile cache when locations changes', function () {

        controller.trigger('delegateTruth', { locations: [{}] }, { locations: [] });

        expect( MapController.prototype.refreshTileCache ).toHaveBeenCalled();

      });

    });

  });

});
