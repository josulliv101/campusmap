define([

    'jquery'

    , 'underscore'

    , 'eventdispatcher'

], function($, _, EventDispatcher) {

    'use strict';


    function SearchboxController(PanelManager) {

        _.bindAll(this, 'handleTruthChange');

        this.PM = PanelManager;

        EventDispatcher.on('delegateTruth', this.handleTruthChange);

    }

    SearchboxController.prototype.handleTruthChange = function(changedAttributes) {

        // Looking for panels attr only
        if (!changedAttributes.panels) return;

        // First, close any open panels
        $.when( this.PM.closePanels() )

         // Then, open.
         .done( this.PM.openPanels );

    };

    SearchboxController.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);

    return SearchboxController;

});