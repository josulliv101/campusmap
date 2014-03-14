define([

    'jquery'

    , 'underscore'

    , 'scripts/views/panels/base'

], function ($, _, BaseView) { 


    //// Constructor ////
    
    function PanelManager() {

        this.panels = [

            new BaseView({ id: 'panel1' }),

            new BaseView({ id: 'panel2' }),

            new BaseView({ id: 'panel3' })

        ];

    }


    //// Methods ////
    
    PanelManager.prototype.getPanelsById = function(ids) {

        var ids = ids.split(',');

        return _.filter(this.panels, function(panel) { return ids.contains(panel.id); } );

    };

    PanelManager.prototype.closePanels = function() {

        return '';

    };

    PanelManager.prototype.openPanels = function() {

        return '';

    };

    return new PanelManager();

});