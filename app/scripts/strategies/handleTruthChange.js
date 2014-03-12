define([

    'underscore'

    , 'scripts/domManager'

    , '_mixins'

], function(_, DomManager) {

    'use strict';

    var cssFlags = ['satellite', 'panel-animations', 'large-labels', 'high-contrast-labels'];

    function Strategy() {}

    Strategy.prototype.addCssFlag = function(model, val, key, classname) {

        // Use the key as the classname if none is provided
        Strategy.prototype.cssFlag(classname || key, { remove: !val });

        return true;

    };

    Strategy.prototype.dispatch = _.dispatch.apply(null,  

        _.map(cssFlags, function(classname) {

            return _.wrap(Strategy.prototype.addCssFlag, function(fn, model, val, key) { 

                return key !== classname ? undefined : fn(model, val, key);

            })

        })

    );

    Strategy.prototype.cssFlag = _.bind(DomManager.cssFlag, DomManager); // Nice to have in test

    return Strategy;

});
