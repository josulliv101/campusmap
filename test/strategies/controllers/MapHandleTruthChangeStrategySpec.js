
define([

  'strategies/controllers/MapHandleTruthChangeStrategy'

], function (Strategy) {

  describe('Map Strategy for handling the Truth Tests', function () {

    var strategy, viz;

    beforeEach(function() {

      spyOn(Strategy.prototype, 'dispatch').andCallThrough();

      spyOn(FakeMapView.prototype, 'setCenter');

      spyOn(FakeMapView.prototype, 'setMapType');

      spyOn(FakeMapView.prototype, 'setCursor');

      viz = new FakeMapView();

      strategy = new Strategy();

    });

    afterEach(function(){


    });

    describe('Truth Handlers', function () {

      it('handles map type change by envoking viz setMapType method', function () {

        strategy.dispatch({}, 'satellite', 'maptype', viz);

        expect( FakeMapView.prototype.setMapType ).toHaveBeenCalledWith('satellite');

      });

      it('handles lat/lng change by envoking viz setCenter method', function () {

        strategy.dispatch({}, { lat: 42, lng: -71 }, 'latlng', viz);

        expect( FakeMapView.prototype.setCenter ).toHaveBeenCalledWith({ lat: 42, lng: -71 });

      });

      it('only handles lat/lng objects as values, no strings', function () {

        strategy.dispatch({}, '42.123,-71.456', 'latlng', viz);

        expect( FakeMapView.prototype.setCenter ).not.toHaveBeenCalled();

      });

      it('handles change change by envoking viz setCursor method', function () {

        strategy.dispatch({}, 'default', 'cursor', viz);

        expect( FakeMapView.prototype.setCursor ).toHaveBeenCalledWith('default');

      });

    });

  });

});

