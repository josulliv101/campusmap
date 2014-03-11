
define([

  '../scripts/router'

], function (Router) {

  describe('Router Tests', function () {

    var router;

    beforeEach(function() {

      router = new Router();

    });

    afterEach(function(){

        Backbone.history.stop();

        router = null;

    });

    describe('Query Strings', function () {

      it('transforms a single slug to a campusid', function () {

        expect( router.processQueryString('medford') ).toBe('campusid=medford');

      });

      it('generates a link pointing directly to a location', function () {

        var qs = router.toLocationQueryString({ details: 'myid', campusmap: 'mymap'});

        expect(qs).toBe('details=myid&campusmap=mymap');

      });

    });

    describe('Defaults', function () {

      it('transforms a query string to an object', function () {

        var defaults = router.getDefaults('test=mytest');

        console.log('defaults', defaults);

        expect( defaults.test ).toBe('mytest');

      });

      it('converts "true" & "false" to boolean values', function () {

        var defaults = router.getDefaults('test1=true&test2=false');

        console.log('defaults', defaults);

        expect( defaults.test1 ).toBe(true);

        expect( defaults.test2 ).toBe(false);

      });

      it('converts string of a number to an Integer', function () {

        var defaults = router.getDefaults('test1=99');

        expect( defaults.test1 ).toBe(99);

      });

      it('removes inappropriate characters', function () {

        var defaults = router.getDefaults('test=mytest<script>');

        console.log('defaults', defaults);

        expect( defaults.test ).toBe('mytestscript');

      });

      it('handles multiple key/val pairs', function () {

        var defaults = router.getDefaults('test1=mytest1&test2=mytest2&test3=mytest3');

        console.log('defaults', defaults);

        expect( defaults.test1 ).toBe('mytest1');

        expect( defaults.test2 ).toBe('mytest2');

        expect( defaults.test3 ).toBe('mytest3');

      });

      it('handles an empty querystring', function () {

        var defaults = router.getDefaults(' ');

        console.log('defaults', defaults);

        expect( defaults ).toEqual({});

      });

    });

  });

});

