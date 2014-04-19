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

        var PM, deferreds, panels = changedAttributes.panels;

        // Looking for panels attr only
        if (!panels) return;

        PM = this.PM;

        // First, close any open panels
        $.when.apply(null, PM.closePanels(panels, changedAttributes.forceclosepanels))

         // Then, open.
         .done(function() {

            if (_.isEmpty(panels)) return;

            PM.openPanels(panels);
         });
    };

    SearchboxController.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);

    return SearchboxController;

});