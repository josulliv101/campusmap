
define([

  'underscore'

  , 'strategies/DataTypeStrategy'

], function (_, Strategy) {

  describe('Strategy for Transforming Raw Truth Tests', function () {

    var strategy, DS, PM;

    beforeEach(function() {

      spyOn(Strategy.prototype, 'dispatch').andCallThrough();

      spyOn(Strategy.prototype, 'stringToBoolean').andCallThrough();

      spyOn(Strategy.prototype, 'stringToInteger').andCallThrough();

      spyOn(Strategy.prototype, 'stringToLatLng').andCallThrough();

      spyOn(Strategy.prototype, 'zoomToInteger').andCallThrough();

      spyOn(Strategy.prototype, 'locationIdsToObjects').andCallThrough();

      spyOn(Strategy.prototype, 'panelIdsToObjects').andCallThrough();

      spyOn(Strategy.prototype, 'campusIdToObject').andCallThrough();

      spyOn(Strategy.prototype, 'locationsDataIntegrity').andCallThrough();

      strategy = new Strategy();

      DS = new FakeDatastore();

      PM = new FakePanelManager();

    });

    afterEach(function(){


    });

    describe('Converting String to Boolean', function () {

      it('ignores a change that is not "true" or "false"', function () {

        strategy.dispatch({}, true, 'mychange', DS, PM);

        expect( Strategy.prototype.stringToBoolean ).not.toHaveBeenCalled();

      });

      it('converts a <string> value to the appropriate Boolean', function () {

        var b1 = strategy.dispatch({}, 'true', 'mychange1', DS, PM), 

            b2 = strategy.dispatch({}, 'false', 'mychange2', DS, PM);

        expect( b1 ).toBe(true);

        expect( b2 ).toBe(false);

      });

      it('does not convert types', function () {

        var b1 = strategy.dispatch({}, 0, 'mychange1', DS, PM), 

          b2 = strategy.dispatch({}, null, 'mychange2', DS, PM);

        expect( b1 ).toBeUndefined();

        expect( b2 ).toBeUndefined();

      });

    });

    describe('Converting String to Integer', function () {

      it('ignores a change that is not match a string of digits', function () {

        strategy.dispatch({}, '123xyz', 'mychange', DS, PM);

        strategy.dispatch({}, true, 'mychange', DS, PM);

        strategy.dispatch({}, '123.99', 'mychange', DS, PM);

        expect( Strategy.prototype.stringToInteger ).not.toHaveBeenCalled();

      });

      it('converts a string of digits to an integer', function () {

        var val1 = strategy.dispatch({}, '123', 'mychange1', DS, PM);

        var val2 = strategy.dispatch({}, '-123', 'mychange2', DS, PM);

        var val3 = strategy.dispatch({}, '0', 'mychange3', DS, PM);

        expect( val1 ).toBe(123);

        expect( val2 ).toBe(-123);

        expect( val3 ).toBe(0);

      });

    });

    describe('Converting String to LatLng', function () {

      it('ignores a change that is not match a lat/lng string', function () {

        strategy.dispatch({}, '42.123123', 'mychange', DS, PM);

        strategy.dispatch({}, '-42.123123', 'mychange', DS, PM);

        expect( Strategy.prototype.stringToLatLng ).not.toHaveBeenCalled();

      });

      it('converts a lat/lng string to a lat/lng object', function () {

        var val1, val2, val3;

        val1 = strategy.dispatch({}, '42.123123,-71.123456', 'mychange1', DS, PM);

        val2 = strategy.dispatch({}, '  -42.123123, -71.123456 ', 'mychange2', DS, PM);

        val3 = strategy.dispatch({}, '42, -71', 'mychange3', DS, PM);

        expect( val1 ).toEqual({ lat : 42.123123, lng : -71.123456 });

        expect( val2 ).toEqual({ lat : -42.123123, lng : -71.123456 });

        expect( val3 ).toEqual({ lat : 42, lng : -71 });

      });

    });

    describe('Converting zoom (+, -) to Integer', function () {

      it('ignores a change that is incrementing/decrementing zoom level', function () {

        strategy.dispatch({}, 12, 'zoom', DS, PM);

        strategy.dispatch({}, '12', 'zoom', DS, PM);

        expect( Strategy.prototype.zoomToInteger ).not.toHaveBeenCalled();

      });

      it('converts string zoom level to integer', function () {

        var val1;

        val1 = strategy.dispatch({}, '12', 'zoom', DS, PM);

        expect( val1 ).toBe(12);

      });

      it('increments/decrements a zoom level by 1', function () {

        var val2, val3;

        val2 = strategy.dispatch({ zoom: 17 }, '+', 'zoom', DS, PM, { get: function() { return 17; }});

        val3 = strategy.dispatch({ zoom: 17 }, '-', 'zoom', DS, PM, { get: function() { return 17; }});

        expect( val2 ).toBe(18);

        expect( val3 ).toBe(16);

      });

    });

    describe('Converting location id to an object', function () {

      it('ignores a change that is already an object', function () {

        strategy.dispatch({}, {}, 'details', DS, PM);

        expect( Strategy.prototype.locationIdsToObjects ).not.toHaveBeenCalled();

      });

      it('converts a location string id to an object reference', function () {

        var val1, val2, val3;

        val1 = strategy.dispatch({}, 'myloc', 'details', DS, PM, { get: function() { return [{ locationid : 'myloc' }]; }});

        expect( val1 ).toEqual({ locationid : 'myloc' });

      });

    });

    describe('Converting panel ids to an array of objects', function () {

      it('ignores a change that is already an object', function () {

        strategy.dispatch({}, {}, 'details', DS, PM);

        expect( Strategy.prototype.panelIdsToObjects ).not.toHaveBeenCalled();

      });

      it('converts a panel string ids to object references', function () {

        var val;

        val = strategy.dispatch({}, 'p1,p2', 'panels', DS, PM);

        expect( val ).toEqual([{ id: 'p1' }, { id: 'p2' }]);

      });

    });

    describe('Converting campus id to an campus model', function () {

      it('ignores a change that is already an object', function () {

        strategy.dispatch({}, {}, 'details', DS, PM);

        expect( Strategy.prototype.campusIdToObject ).not.toHaveBeenCalled();

      });

      it('converts a campus string id to object reference', function () {

        var val = strategy.dispatch({}, 'medford', 'campus', DS, PM);

        expect( val ).toEqual({ id: 'medford' });

      });

    });

    describe('Converting locations lat/lng to objects', function () {

      it('converts a string id to object for location', function () {

        var loc1 = { latlng: '42,-71' }, loc2 = { latlng: '42.999,-71.999' };

            strategy.dispatch({}, [ loc1, loc2 ], 'locations', DS, PM);

        expect( loc1 ).toEqual({ latlng : { lat : 42, lng : -71 } });

        expect( loc2 ).toEqual({ latlng : { lat : 42.999, lng : -71.999 } });

      });

    });

  });

});
