define(['../../scripts/datastore/datastore-jsonp'], function (DatastoreJSONP) {

  describe('DatastoreJSONP Tests', function () {

    var campusList, mapList;

    beforeEach(function() {

      //campuses = _.resetItems(DatastoreJSON.campusList().models);

      //maps = _.resetItems(DatastoreJSON.mapList().models);

    });

    afterEach(function() {

    });

    describe('The Interface Functions', function () {

      it('implement the datastore interface.', function () {

        expect(DatastoreJSONP.fetch).toBeDefined();

        expect(DatastoreJSONP.getCampusList).toBeDefined();

        expect(DatastoreJSONP.getCampus).toBeDefined();

      });

    });

  });

});