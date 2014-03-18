
define([
  
  '../../../scripts/views/map/GoogleMap'

], function (GoogleMapView) {

  describe('Google Map View Tests', function () {

    var mapView, el = document.getElementsByTagName('body')[0];

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
