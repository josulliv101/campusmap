
define([
  
  '../scripts/domManager'

], function (DomManager) {

  describe('DomManager Tests', function () {

    beforeEach(function() {

    });

    afterEach(function(){

    });

    describe('Functions', function () {

      it('creates the html for a label tile', function () {

        var div = DomManager.getLabelTile('fake-tile-id', document, [{ name: 'my label' }]);

        expect( div.className ).toBe('label-tile-container');

      });

    });

  });

});
