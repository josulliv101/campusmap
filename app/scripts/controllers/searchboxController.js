define([

    'jquery'

    , 'underscore'

    , 'eventdispatcher'

], function($, _, EventDispatcher) {

    'use strict';


    function SearchboxController(PanelManager) {

        _.bindAll(this, 'handleTruthChangeSB');

        this.PM = PanelManager;

        this.PM.initialize();

        EventDispatcher.on('delegateTruth', this.handleTruthChangeSB);

    }

    SearchboxController.prototype.handleTruthChangeSB = function(changedAttributes) {

        var PM, deferredsClosePanels, panels = changedAttributes.panels, self = this;
console.log('handleTruthChange sbcontroller', changedAttributes);
        // Looking for panels attr only
        if (!panels || this.transition === true) return;

        PM = this.PM;

        this.transition = true;

        deferredsClosePanels = PM.closePanels(panels, changedAttributes.forceclosepanels);
console.log('handleTruthChange sbcontroller 2', panels);
        // First, close any open panels
        $.when.apply(null, deferredsClosePanels)

         // Then, open.
         .done(function() {

            EventDispatcher.trigger('truthupdate', { paneltransitiondone: _.uniqueId('panelsopen_') }, { silent: false });

            if (_.isEmpty(panels)) {

                self.transition = false;

                return;

            }

            $.when.apply(null, PM.openPanels(panels)).done(_.throttle(function() { 

                //if (!_.isEmpty(panels)) {

                    EventDispatcher.trigger('truthupdate', { paneltransitiondone: _.uniqueId('panelsopen_') }, { silent: false });

                //}

                self.transition = false;

            }, 1000));

         });
    };

    SearchboxController.prototype.handlePanelsOpen = _.bind(EventDispatcher.trigger, EventDispatcher);

    SearchboxController.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);

    return SearchboxController;

});