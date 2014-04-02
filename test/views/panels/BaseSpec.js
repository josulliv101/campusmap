
define([
  
  '../../../scripts/panelManager'

], function (PM) {

  describe('Base View Tests', function () {

    var baseView;

    beforeEach(function() {

      baseView = PM.createPanel();

    });

    afterEach(function(){


    });


    describe('Functions', function () {

      it('nests its json in a "model" attribute', function () {

        var json = baseView.toJSON();

        expect( json.model ).toBeDefined();

      });

      it('starts off with a state of "close"', function () {

        var state = baseView.model.get('state');

        expect( state ).toBe('close');

      });

      it('handles an open state change', function () {

        var state = baseView.handleStateChange({}, 'open');

        expect( state ).toBe('open');

      });

      it('handles a close state change', function () {

        var state = baseView.handleStateChange({}, 'close');

        expect( state ).toBe('close');

      });

      it('handles an openPre state change', function () {

        var state = baseView.handleStateChange({}, 'openPre');

        expect( state ).toBe('openPre');

      });

      it('handles a closePre state change', function () {

        var state = baseView.handleStateChange({}, 'closePre');

        expect( state ).toBe('closePre');

      });

    });

  });

});
