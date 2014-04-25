
define([
  
  '../scripts/panelManager'

], function (PM) {

  describe('PanelManager Tests', function () {

    beforeEach(function() {

      // Avoid any deferred actions
      PM.transition = undefined;

    });

    afterEach(function(){

      PM.panels = [];

    });


    describe('Functions', function () {

      it('creates a new Panel View', function () {

        var view = PM.createPanel('mypanel');

        expect( view.id ).toBe('mypanel');

        expect( view.model ).toBeDefined();

      });

      it('adds a new panel to the panel array', function () {

        var view = PM.createPanel('mypanel');

        expect( PM.panels.length ).toBe(1);

      });

      it('creates a new panel if not found in the panels array', function () {

        var view = PM.getPanel('mypanel');

        expect( PM.panels.length ).toBe(1);

      });

      it('retrieves an existing panel by id from the panels array', function () {

        // Create a couple panels
        var view1 = PM.getPanel('mypanel1'), view2 = PM.getPanel('mypanel2'), view3;

        expect( PM.panels.length ).toBe(2);

        view3 = PM.getPanel('mypanel2');

        // Still 2 
        expect( PM.panels.length ).toBe(2);

      });

      it('closes panels', function () {

        var view1 = PM.getPanel('mypanel1'), view2 = PM.getPanel('mypanel2');

        view1.model.set({ state: 'open' });

        view2.model.set({ state: 'open' });

        PM.closePanels();

        expect( view1.state() ).toBe('close');

        expect( view2.state() ).toBe('close');

      });

      it('open panels', function () {

        var view1 = PM.getPanel('mypanel1'), view2 = PM.getPanel('mypanel2');

        PM.openPanels([view1, view2]);

        expect( view1.state() ).toBe('open');

        expect( view2.state() ).toBe('open');

      });

      it('gets a single panel by id when similar names found', function () {

        //var view1 = PM.getPanel('mypanel1'), view2 = PM.getPanel('mypanel2');

        //PM.openPanels([view1, view2]);

        //expect( view1.state() ).toBe('open');

        //expect( view2.state() ).toBe('open');

      });

    });

  });

});
