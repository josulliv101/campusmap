define([

    'jquery'

    , 'underscore'

    , 'scripts/panelManager'

    , 'eventdispatcher'

], function($, _, PanelManager, EventDispatcher) {

    'use strict';


    function SearchboxController(searchboxview, AnimationConstructor) {

        EventDispatcher.on('delegateTruth', this.handleTruthChange);

    }

    SearchboxController.prototype.handleTruthChange = function(changedAttributes) {

        if (!changedAttributes.panels) return;



    };

    SearchboxController.prototype.trigger = _.bind(EventDispatcher.trigger, EventDispatcher);

    return SearchboxController;

});