define([

    'jquery'

    , 'underscore'

    , 'datastore'

    , 'scripts/views/panels/Base'

], function ($, _, Datastore, BaseView) { 

    var instance,

        openTransition = { open: function(panel) { panel.$el.show(); panel.model.set({ state: 'open' }); } },

        closeTransition = { close: function(panel) { panel.$el.hide(); panel.model.set({ state: 'close' }); } };

    //// Constructor ////
    
    function PanelManager() {

        this.panels = [];

    }


    //// Methods ////

    PanelManager.prototype.initialize = function() {

        this.$container = $('#container-panels');

        this.createPanel('panel1');

        this.createPanel('panel2');

        this.createPanel('panel3');

        this.init = true;

    };
    
    PanelManager.prototype.getPanelsById = function(ids) {

        ids = ids.split(',');

        return _.filter(this.panels, function(panel) { return _.contains(ids, panel.id); } );

    };

    PanelManager.prototype.closePanels = function() {

        return _.map(this.panels, function(panel) { 

            return panel.close(closeTransition); 

        });

    };

    PanelManager.prototype.openPanels = function(panels) {

        return _.map(panels, function(panel) { 

            return panel.open(openTransition); 

        });

    };

    PanelManager.prototype.createPanel = function(id) {

        var panel = new BaseView({ id: id, model: new Datastore.Model() });

        this.panels.push(panel);

        // Attach it to the DOM
        panel.render().$el.appendTo(this.$container);

        return panel;

    };

    PanelManager.prototype.getPanel = function(id) {

        return _.chain( this.getPanelsById(id) ).first().value() || this.createPanel(id);

    };

    return new PanelManager();

});