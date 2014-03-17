define([

    'underscore'

    , 'scripts/domManager'

    , '_mixins'

], function(_, DomManager) {

    'use strict';

    var cssFlags = ['satellite', 'panel-animations', 'large-labels', 'high-contrast-labels', 'accessibility', 'parking', 'mapstyle-inverted'];

    function CssFlagStrategy() {

        this.type = 'truthhandler';

    }

    // Add/remove a css flag set on the app root DOM element
    CssFlagStrategy.prototype.addCssFlag = function(model, val, key, classname) {

        // Use the key as the classname if none is provided
        CssFlagStrategy.prototype.cssFlag(classname || key, { remove: !val });

        return true;

    };

    CssFlagStrategy.prototype.dispatch = _.dispatch.apply(null,  

        // Map each attribute to a function which adds/removes the css flag
        _.map(cssFlags, function(classname) {

            return _.wrap(CssFlagStrategy.prototype.addCssFlag, function(fn, model, val, key) { 

                return key !== classname ? undefined : fn(model, val, key);

            });

        })

    );

    CssFlagStrategy.prototype.cssFlag = _.bind(DomManager.cssFlag, DomManager); // Nice to have in test

    return CssFlagStrategy;

});
