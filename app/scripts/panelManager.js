define([

    'jquery'

    , 'underscore'

    , 'datastore'

    , 'scripts/views/panels/Base'

], function ($, _, Datastore, BaseView) { 

    var Transition = {};

    //// Constructor ////
    
    function PanelManager() {

        this.panels = [];

        this.createPanel('panel1');

        this.createPanel('panel2');

        this.createPanel('panel3');

    }


    //// Methods ////
    
    PanelManager.prototype.getPanelsById = function(ids) {

        ids = ids.split(',');

        return _.filter(this.panels, function(panel) { return _.contains(ids, panel.id); } );

    };

    PanelManager.prototype.closePanels = function() {

        return _.map(this.panels, function(panel) { 

            return panel.close(); 

        });

    };

    PanelManager.prototype.openPanels = function() {

        return _.map(this.panels, function(panel) { 

            return panel.open(); 

        });

    };

    PanelManager.prototype.createPanel = function(id) {

        var panel = new BaseView({ id: id, model: new Datastore.Model() });

        this.panels.push(panel);

        return panel;

    };

    PanelManager.prototype.getPanel = function(id) {

        return _.chain( this.getPanelsById(id) ).first().value() || this.createPanel(id);

    };

    return new PanelManager();

});