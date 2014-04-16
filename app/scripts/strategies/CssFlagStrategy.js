define([

    'underscore'

    , 'scripts/domManager'

    , '_mixins'

], function(_, DomManager) {

    'use strict';

    var cssFlags = ['streetview', 'searchbox-open', 'satellite', 'panel-animations', 'large-labels', 'high-contrast-labels', 'accessibility', 'parking', 'mapstyle-inverted'];

    function CssFlagStrategy() {

        this.type = 'truthhandler';

    }

    // Add/remove a css flag set on the app root DOM element
    CssFlagStrategy.prototype.addCssFlag = function(model, val, key, classname) {

        // Use the key as the classname if none is provided
        CssFlagStrategy.prototype.cssFlag(classname || key, { remove: !val });

        return true;

    };

    CssFlagStrategy.prototype.handleZoomChange = function(model, val, key, classname) {

        if (key !== 'zoom') return;

        console.log('zoom');

        DomManager.$root.removeClass("zoomed-out zoomed-in zoom-15 zoom-16 zoom-17 zoom-18 zoom-19 zoom-20");

        if (val < 15) DomManager.$root.addClass('zoomed-out');

        else if (val > 17) DomManager.$root.addClass('zoomed-in');

        else {

            DomManager.$root.addClass('zoom-' + val);

        }

        return true;

    };

    CssFlagStrategy.prototype.dispatch = _.dispatch.apply(null,  

        _.union(

            // Map each attribute to a function which adds/removes the css flag
            _.map(cssFlags, function(classname) {

                return _.wrap(CssFlagStrategy.prototype.addCssFlag, function(fn, model, val, key) { 

                    return key !== classname ? undefined : fn(model, val, key);

                });

            }),

            [ CssFlagStrategy.prototype.handleZoomChange ]
        )

    );

    CssFlagStrategy.prototype.cssFlag = _.bind(DomManager.cssFlag, DomManager); // Nice to have in test

    return CssFlagStrategy;

});
