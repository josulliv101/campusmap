
define([
  
  '../scripts/controllers/searchboxController'

], function (SearchboxController) {

  describe('Searchbox Controller Tests', function () {

    var controller;

    beforeEach(function() {

      spyOn(SearchboxController.prototype, 'handleTruthChange').andCallThrough();

      controller = new SearchboxController();
      
    });

    afterEach(function(){

        controller = null;

    });


    describe('Functions', function () {

      it('handles updates to the Truth', function () {

        controller.trigger('delegateTruth', { myattr: 123 });

        expect( SearchboxController.prototype.handleTruthChange ).toHaveBeenCalled();

      });

    });

  });

});
