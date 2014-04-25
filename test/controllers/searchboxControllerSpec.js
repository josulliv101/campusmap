
define([
  
  '../../scripts/controllers/searchboxController'

], function (SearchboxController) {

  describe('Searchbox Controller Tests', function () {

    var controller, PM;

    beforeEach(function() {

      spyOn(SearchboxController.prototype, 'handleTruthChangeSB').andCallThrough();

      PM = new FakePanelManager();

      controller = new SearchboxController(PM);
      
    });

    afterEach(function(){

        controller = null;

    });


    describe('Functions', function () {

      it('handles updates to the Truth', function () {

        controller.trigger('delegateTruth', { myattr: 123 });

        expect( SearchboxController.prototype.handleTruthChangeSB ).toHaveBeenCalled();

      });

      it('tries to open panels if there is a change in the Truth\'s panels attribute', function () {

        spyOn(controller.PM, 'openPanels');

        controller.trigger('delegateTruth', { panels: [ new FakePanel('panel1') ] });

        expect( controller.PM.openPanels ).toHaveBeenCalled();

      });

    });

  });

});
