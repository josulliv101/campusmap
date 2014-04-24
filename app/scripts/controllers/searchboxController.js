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

        var PM, deferreds, panels = changedAttributes.panels, self = this;

        // Looking for panels attr only
        if (!panels || this.transition === true) return;

        PM = this.PM;

        this.transition = true;

        deferreds = PM.closePanels(panels, changedAttributes.forceclosepanels);

        // First, close any open panels
        $.when.apply(null, deferreds)

         // Then, open.
         .done(function() {

            if (_.isEmpty(panels)) {

                self.transition = false;

                return;

            }

            $.when.apply(null, PM.openPanels(panels)).done(function() { 

                EventDispatcher.trigger('truthupdate', { paneltransitiondone: true });

                self.transition = false;

            });

         });
    };

    SearchboxController.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);

    return SearchboxController;

});