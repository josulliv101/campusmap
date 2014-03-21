
define([
  
  '../../../scripts/views/map/LabelMapType'

], function (LabelMapType) {

  describe('Google Map View Tests', function () {

    var labelMapType;

    beforeEach(function() {

      labelMapType = new LabelMapType(256, new FakeMapUtils());

    });

    afterEach(function(){


    });

    describe('Basic', function () {

      it('have reference to map utils', function () {

        expect( labelMapType.utils ).toBeDefined();

      });

      it('creates a label tile div element', function () {

        var el = labelMapType.getTile({x: 3, y: 2}, 17, document);

        expect( el ).toBeDefined();

      });

      it('has a className of tile-label', function () {

        var el = labelMapType.getTile({x: 3, y: 2}, 17, document);

        expect( el.className ).toBe('label-tile-container');

      });

    });

  });

});
