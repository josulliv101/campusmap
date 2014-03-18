
define([
  
  '../../../scripts/views/map/GoogleMap'

], function (GoogleMapView) {

  describe('Google Map View Tests', function () {

    var mapView, el = document.getElementById('map-canvas');

    beforeEach(function() {

      mapView = new GoogleMapView({ el: el });

    });

    afterEach(function(){


    });

    describe('Initialization', function () {

      it('creates a google map object when instantiated', function () {

        expect( mapView.map ).toBeDefined();

      });

    });

  });

});
