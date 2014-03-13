
define([

  'strategies/StateManagementStrategy'

], function (Strategy) {

  describe('Strategy for Transforming Raw Truth Relating to State Tests', function () {

    var strategy;

    beforeEach(function() {

      spyOn(Strategy.prototype, 'dispatch').andCallThrough();

      spyOn(Strategy.prototype, 'toggle').andCallThrough();

      strategy = new Strategy();

    });

    afterEach(function(){


    });

    describe('toggling state', function () {

      it('ignores a change that is not a "toggle"', function () {

        strategy.dispatch({}, true, 'mystate');

        expect( Strategy.prototype.toggle ).not.toHaveBeenCalled();

      });

      it('toggles the boolean state of an attribute', function () {

        var b1 = strategy.dispatch({ mystate1: true }, 'toggle', 'mystate1'), 

          b2 = strategy.dispatch({ mystate1: false }, 'toggle', 'mystate2');

        expect( b1 ).toBe(false);

        expect( b2 ).toBe(true);

      });

    });

  });

});

