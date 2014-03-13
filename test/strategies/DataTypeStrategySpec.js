
define([

  'strategies/DataTypeStrategy'

], function (Strategy) {

  describe('Strategy for Transforming Raw Truth Tests', function () {

    var strategy;

    beforeEach(function() {

      spyOn(Strategy.prototype, 'dispatch').andCallThrough();

      spyOn(Strategy.prototype, 'stringToBoolean').andCallThrough();

      spyOn(Strategy.prototype, 'stringToInteger').andCallThrough();

      strategy = new Strategy();

    });

    afterEach(function(){


    });

    describe('Converting String to Boolean', function () {

      it('ignores a change that is not "true" or "false"', function () {

        strategy.dispatch({}, true, 'mychange');

        expect( Strategy.prototype.stringToBoolean ).not.toHaveBeenCalled();

      });

      it('converts a <string> value to the appropriate Boolean', function () {

        var b1 = strategy.dispatch({}, 'true', 'mychange1'), 

          b2 = strategy.dispatch({}, 'false', 'mychange2');

        expect( b1 ).toBe(true);

        expect( b2 ).toBe(false);

      });

      it('does not convert types', function () {

        var b1 = strategy.dispatch({}, 0, 'mychange1'), 

          b2 = strategy.dispatch({}, null, 'mychange2');

        expect( b1 ).toBeUndefined();

        expect( b2 ).toBeUndefined();

      });

    });

    describe('Converting String to Integer', function () {

      it('ignores a change that is not match a string of digits', function () {

        strategy.dispatch({}, '123xyz', 'mychange');

        strategy.dispatch({}, true, 'mychange');

        strategy.dispatch({}, '123.99', 'mychange');

        expect( Strategy.prototype.stringToInteger ).not.toHaveBeenCalled();

      });

      it('converts a string of digits to an integer', function () {

        var val1 = strategy.dispatch({}, '123', 'mychange1');

        var val2 = strategy.dispatch({}, '-123', 'mychange2');

        var val3 = strategy.dispatch({}, '0', 'mychange3');

        expect( val1 ).toBe(123);

        expect( val2 ).toBe(-123);

        expect( val3 ).toBe(0);

      });

    });

  });

});

