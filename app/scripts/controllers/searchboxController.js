define([

    'jquery'

    , 'underscore'

    , 'eventdispatcher'

], function($, _, EventDispatcher) {

    'use strict';


    function SearchboxController(PanelManager) {

        _.bindAll(this, 'handleTruthChange');

        this.PM = PanelManager;

        this.PM.initialize();

        EventDispatcher.on('delegateTruth', this.handleTruthChange);

    }

    SearchboxController.prototype.handleTruthChange = function(changedAttributes) {

        var PM;

        // Looking for panels attr only
        if (!changedAttributes.panels) return;

        PM = this.PM;

        // First, close any open panels
        $.when( PM.closePanels() )

         // Then, open.
         .done(function() {

            PM.openPanels(changedAttributes.panels);

         });

    };

    SearchboxController.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);

    return SearchboxController;

});