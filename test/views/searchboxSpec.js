
define([

  'jquery'

  , '../../scripts/views/searchbox'

  , 'datastore'

  , 'eventdispatcher'

  , '../../../bower_components/jasmine-jquery/lib/jasmine-jquery'

], function ($, View, Datastore, EventDispatcher) {

  describe('Searchbox View Tests', function () {

    var view;

    beforeEach(function() {

      spyOn(View.prototype, 'handleTruthChange').andCallThrough();

      view = new View({ model: new Datastore.Model() });

    });

    afterEach(function() {

      EventDispatcher.unbind('delegateTruth');

    });

    describe('Event Handling', function () {

      it('handles a change to the truth', function () {

        view.trigger('delegateTruth', { mytruth: 123, other: 321 });

        expect( View.prototype.handleTruthChange ).toHaveBeenCalled();

      });

      it('updates its model with the changed attributes', function () {

        view.trigger('delegateTruth', { mytruth: 123, other: 321 });

        expect( view.model.get('mytruth') ).toBe(123);

        expect( view.model.get('other') ).toBe(321);

      });

    });

    describe('Rendering', function () {

      it('renders html', function () {

        view.render();

        expect( view.$el ).toBeDefined();

      });

      it('renders the primary label based on the truth attributes', function () {

        var label = 'my label';

        view.trigger('delegateTruth', { primarylabel: label });

        view.render();

        expect( view.$('#searchbox').val() ).toEqual( label );

        expect( view.$('.sr-only.label-primary').html() ).toEqual( label );

      });

    });

  });

});

