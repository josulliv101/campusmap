define([

    'jquery'

    , 'underscore'

    , 'datastore'

    , 'transition'

    , 'scripts/views/panels/Base'

], function ($, _, Datastore, Transition, BaseView) { 

    var instance;

    //// Constructor ////
    
    function PanelManager() {

        this.panels = [];

        this.transition = new Transition();

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

            return panel.close(this.transition); 

        }, this);

    };

    PanelManager.prototype.openPanels = function(panels) {

        return _.map(panels, function(panel) { 

            return panel.open(this.transition); 

        }, this);

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