
define(['_mixins', '../scripts/filter', 'backbone'], function (_, Filter, Backbone) {

  describe('_mixins Filter Tests', function () {

    var results, locsCollection;

    beforeEach(function() {

      locsCollection = new Backbone.Collection([

        { name: 'Ballou Hall', id: 'm001', locationid: 'xyz', descr: 'my test descr for Ballou' },

        { name: 'Houston Hall', id: 'm002', locationid: 'abc', descr: 'my test descr abc' },

        { name: '80 George Street', id: 'm003', locationid: 'hij', descr: 'my test descr' },

        { name: 'test SHall', id: 'm004', locationid: 'lmn', descr: 'my descr 2' }

      ]);

    });

    afterEach(function(){

      locsCollection = null;

    });

    describe('Getting available methods', function () {

      it('should have a filter method and query object exposed', function () {

        expect(Filter.filter).toBeDefined();

        expect(Filter.getQuery).toBeDefined();

      });

    });

    describe('Filtering of data', function () {

      it('should filter on a <String> matching an attribute', function () {

        results = Filter.filter('Hall', locsCollection.models, 'name');

        expect(results).toBeDefined();

        expect(results.length).toEqual(2);

        results = Filter.filter('Geo', locsCollection.models, 'name');

        expect(results.length).toEqual(1);

      });

      it('should filter on a <Object> cooresponding to an attribute', function () {

        var f = { label: 'Custom Label', filter: 'id' };

        results = Filter.filter('m', locsCollection.models, [f]);

        expect(results.length).toEqual(4);

        results = Filter.filter('2', locsCollection.models, [f]);

        expect(results.length).toEqual(0); // Only matches startswith

      });

      it('should filter on multiple attributes', function () {

        results = Filter.filter('test', locsCollection.models, ['name', 'descr']);

        expect(results.length).toEqual(4);

        results = Filter.filter('abc', locsCollection.models, ['locationid', 'descr']);

        expect(results.length).toEqual(1);

        results = Filter.filter('abc', locsCollection.models, [{ filter: 'locationid' }, 'descr']);

        expect(results.length).toEqual(1);

      });

      it('should filter on passed in fns making use of query term', function () {

        var fnExactMatch= function(loc) { var name = _.getAttr(loc, 'name'); return name && name.toLowerCase() === Filter.getQuery().term; };

        results = Filter.filter('Ballou Hall', locsCollection.models, [fnExactMatch]);

        expect(results.length).toEqual(1);

        results = Filter.filter('Ballou Hall', locsCollection.models, fnExactMatch);

        expect(results.length).toEqual(1);

        results = Filter.filter('Houston Hall', locsCollection.models, [{ label: 'mylabel', filter: fnExactMatch }]);

        expect(results.length).toEqual(1);
 

      });

      it('should filter on passed in fns matching non-query', function () {

        var fnNameLength = function(loc) { return _.getAttr(loc, 'name').length > 11; };

        results = Filter.filter('', locsCollection.models, [fnNameLength]);

        expect(results.length).toEqual(2);
 

      });

      it('should match only on beginings of words', function () {

        var results = Filter.filter('Hall', locsCollection.models, 'name');

        expect(results).toBeDefined();

        expect(results.length).toEqual(2);


      });

      it('should return results if a space is in the search term (Ballou H)', function () {

        var results = Filter.filter('Ballou H', locsCollection.models, 'name');

        expect(results).toBeDefined();

        expect(results.length).toEqual(1);


      });

      it('should return results if a space is in the search term but in the middle of the string (George str)', function () {

        var results = Filter.filter('George str', locsCollection.models, 'name');

        expect(results).toBeDefined();

        expect(results.length).toEqual(1);


      });

      it('should not return results if multiple words but does not start a word or begin phrase (eorge Str)', function () {

        var results = Filter.filter('0 george Str', locsCollection.models, 'name');

        expect(results).toBeDefined();

        expect(results.length).toEqual(0);


      });

    });

  });

});