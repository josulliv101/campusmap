
define([

  'strategies/DataTypeStrategy'

], function (Strategy) {

  describe('Strategy for Transforming Raw Truth Tests', function () {

    var strategy, DS;

    beforeEach(function() {

      spyOn(Strategy.prototype, 'dispatch').andCallThrough();

      spyOn(Strategy.prototype, 'stringToBoolean').andCallThrough();

      spyOn(Strategy.prototype, 'stringToInteger').andCallThrough();

      spyOn(Strategy.prototype, 'stringToLatLng').andCallThrough();

      spyOn(Strategy.prototype, 'zoomToInteger').andCallThrough();

      spyOn(Strategy.prototype, 'idsToObjects').andCallThrough();

      strategy = new Strategy();

      DS = new FakeDatastore();

    });

    afterEach(function(){


    });

    describe('Converting String to Boolean', function () {

      it('ignores a change that is not "true" or "false"', function () {

        strategy.dispatch({}, true, 'mychange', DS);

        expect( Strategy.prototype.stringToBoolean ).not.toHaveBeenCalled();

      });

      it('converts a <string> value to the appropriate Boolean', function () {

        var b1 = strategy.dispatch({}, 'true', 'mychange1', DS), 

          b2 = strategy.dispatch({}, 'false', 'mychange2', DS);

        expect( b1 ).toBe(true);

        expect( b2 ).toBe(false);

      });

      it('does not convert types', function () {

        var b1 = strategy.dispatch({}, 0, 'mychange1', DS), 

          b2 = strategy.dispatch({}, null, 'mychange2', DS);

        expect( b1 ).toBeUndefined();

        expect( b2 ).toBeUndefined();

      });

    });

    describe('Converting String to Integer', function () {

      it('ignores a change that is not match a string of digits', function () {

        strategy.dispatch({}, '123xyz', 'mychange', DS);

        strategy.dispatch({}, true, 'mychange', DS);

        strategy.dispatch({}, '123.99', 'mychange', DS);

        expect( Strategy.prototype.stringToInteger ).not.toHaveBeenCalled();

      });

      it('converts a string of digits to an integer', function () {

        var val1 = strategy.dispatch({}, '123', 'mychange1', DS);

        var val2 = strategy.dispatch({}, '-123', 'mychange2', DS);

        var val3 = strategy.dispatch({}, '0', 'mychange3', DS);

        expect( val1 ).toBe(123);

        expect( val2 ).toBe(-123);

        expect( val3 ).toBe(0);

      });

    });

    describe('Converting String to LatLng', function () {

      it('ignores a change that is not match a lat/lng string', function () {

        strategy.dispatch({}, '42.123123', 'mychange', DS);

        strategy.dispatch({}, '-42.123123', 'mychange', DS);

        expect( Strategy.prototype.stringToLatLng ).not.toHaveBeenCalled();

      });

      it('converts a lat/lng string to a lat/lng object', function () {

        var val1, val2, val3;

        val1 = strategy.dispatch({}, '42.123123,-71.123456', 'mychange1', DS);

        val2 = strategy.dispatch({}, '  -42.123123, -71.123456 ', 'mychange2', DS);

        val3 = strategy.dispatch({}, '42, -71', 'mychange3', DS);

        expect( val1 ).toEqual({ lat : '42.123123', lng : '-71.123456' });

        expect( val2 ).toEqual({ lat : '-42.123123', lng : '-71.123456' });

        expect( val3 ).toEqual({ lat : '42', lng : '-71' });

      });

    });

    describe('Converting zoom (+, -) to Integer', function () {

      it('ignores a change that is incrementing/decrementing zoom level', function () {

        strategy.dispatch({}, 12, 'zoom', DS);

        strategy.dispatch({}, '12', 'zoom', DS);

        expect( Strategy.prototype.zoomToInteger ).not.toHaveBeenCalled();

      });

      it('converts string zoom level to integer', function () {

        var val1;

        val1 = strategy.dispatch({}, '12', 'zoom', DS);

        expect( val1 ).toBe(12);

      });

      it('increments/decrements a zoom level by 1', function () {

        var val2, val3;

        val2 = strategy.dispatch({ zoom: 17 }, '+', 'zoom', DS);

        val3 = strategy.dispatch({ zoom: 17 }, '-', 'zoom', DS);

        expect( val2 ).toBe(18);

        expect( val3 ).toBe(16);

      });

    });

    describe('Converting location id to an object', function () {

      it('ignores a change that is already an object', function () {

        strategy.dispatch({}, {}, 'details', DS);

        expect( Strategy.prototype.idsToObjects ).not.toHaveBeenCalled();

      });

      it('converts a location string id to an object reference', function () {

        var val1, val2, val3;

        val1 = strategy.dispatch({}, 'myloc', 'details', DS);

        expect( val1 ).toEqual({ id : 'myloc' });

      });

    });

  });

});

function FakeDatastore() {}

FakeDatastore.prototype.getLocationById = function(id) { return { id: id }; };
