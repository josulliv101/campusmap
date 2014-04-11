define([

    'jquery'

    , 'underscore'

    , 'datastore'

    , 'transition'

    , 'scripts/views/panels/Base'

    , 'scripts/views/panels/details'

], function ($, _, Datastore, Transition, BaseView, DetailsView) { 

    var instance;

    //// Constructor ////
    
    function PanelManager() {

        this.panels = [];

        this.transition = new Transition();

    }


    //// Methods ////

    PanelManager.prototype.initialize = function() {

        this.$container = $('#container-panels');

        
        // If no panel constructor defined, the Base is used

        this.createPanel('details', DetailsView);

        this.createPanel('accessibility'); // test

        this.createPanel('directions'); // test

        this.createPanel('sharelink'); // test

        this.init = true;

    };
    
    PanelManager.prototype.getPanelsById = function(ids) {

        ids = ids.split(',');

        return _.filter(this.panels, function(panel) { return _.contains(ids, panel.id); } );

    };

    PanelManager.prototype.closePanels = function(panelsToOpen, forceClose) {

        // Don't close a panel if it needs to be reopened, or any that are already closed.
        var ids = _.map(panelsToOpen, function(p) { return p.id; }),

            panelsToClose = _.reject(this.panels, function(panel) { return panel.model.get('state') !== 'open' || _.contains(ids, panel.id); });

        // Force all panels to close no matter what
        if (forceClose === true) panelsToClose = this.panels;

        return _.map(panelsToClose, function(panel, index) { 

            return panel.close(this.transition, index); 

        }, this);

    };

    PanelManager.prototype.openPanels = function(panelsToOpen) {

        return _.map(panelsToOpen, function(panel) { 

            return panel.open(this.transition); 

        }, this);

    };

    PanelManager.prototype.createPanel = function(id, constructor) {

        var Constructor = constructor || BaseView,

            panel = new Constructor({ id: id, model: new Datastore.Model() });

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