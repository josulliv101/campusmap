define([

    'jquery'

    , 'underscore'

    , 'datastore'

    , 'transition'

    , 'scripts/views/panels/Base'

    , 'scripts/views/panels/details'

    , 'scripts/views/panels/directions'

    , 'scripts/views/panels/results'

], function ($, _, Datastore, Transition, BaseView, DetailsView, DirectionsView, ResultsView) { 

    var instance;

    //// Constructor ////
    
    function PanelManager() {

        this.panels = [];

        this.transition = new Transition();

    }


    //// Methods ////

    PanelManager.prototype.initialize = function() {

        this.$container = $('#container-panels');

        
        //// If no panel constructor defined, the Base panel view is used ////

        // Primary Panels
        this.createPanel('details', DetailsView);

        this.createPanel('results', ResultsView);

        // Secondary Panels
        this.createPanel('accessibility'); 

        this.createPanel('directions', DirectionsView); 

        this.createPanel('sharelink');

        this.createPanel('hint-map-icons'); 

        this.createPanel('select-destination');

        this.createPanel('popular-tags');

        this.createPanel('printable-maps');

        this.createPanel('settings');
        
        this.init = true;

    };
    
    PanelManager.prototype.getPanelsById = function(ids) {

        var panels =  _.chain(ids.split(','))

                       // See if any panels want to be toggled (specified by '+' at end of id)
                       .map(function(id) { 

                            var panel, panelid = id.replace('+', '');

                            if (_.isEmpty(id)) return;
                            
                            panel = _.find(this.panels, function(panel) { return panel.id === panelid; });

                            return panel && id.indexOf('+') > 0 && panel.state() === 'open' ? undefined : panel;

                        }, this)

                       // Don't include any that should be toggled shut
                       .reject(function(panel) {

                            return panel === undefined;

                       })

                       .value();
 
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

        // An reference to the PanelManager just in case
        panel.manager = this;

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