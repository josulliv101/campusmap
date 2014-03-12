
define([

  'strategies/handleTruthChange'

], function (Strategy) {

  describe('Strategy for TruthChange Tests', function () {

    var strategy;

    beforeEach(function() {

      spyOn(Strategy.prototype, 'dispatch').andCallThrough();

      spyOn(Strategy.prototype, 'cssFlag');

      strategy = new Strategy('handle-truth-change', 'handler');

    });

    afterEach(function(){


    });

    describe('CSS Flags', function () {

      it('handles a change in satellite mode', function () {

        strategy.dispatch({}, false, 'satellite');

        expect( Strategy.prototype.cssFlag ).toHaveBeenCalledWith('satellite', { remove: true });

        strategy.dispatch({}, true, 'satellite');

        expect( Strategy.prototype.cssFlag ).toHaveBeenCalledWith('satellite', { remove: false });

      });

      it('handles a change in panel-animations mode', function () {

        strategy.dispatch({}, false, 'panel-animations');

        expect( Strategy.prototype.cssFlag ).toHaveBeenCalledWith('panel-animations', { remove: true });

        strategy.dispatch({}, true, 'panel-animations');

        expect( Strategy.prototype.cssFlag ).toHaveBeenCalledWith('panel-animations', { remove: false });

      });

    });

  });

});

