define([

    'underscore'

    , '_mixins'

], function(_) {

    'use strict';


    function StateManagementStrategy() {

        this.type = 'truth-data-transformer';

    }

    // Toggles a Boolean value of an attribute
    StateManagementStrategy.prototype.toggle = function(model, val, key) {

        if (val !== 'toggle') return;

        return  val = !model[key];

    };


    StateManagementStrategy.prototype.dispatch = _.dispatch( 

        StateManagementStrategy.prototype.toggle

    );

    return StateManagementStrategy;

});
