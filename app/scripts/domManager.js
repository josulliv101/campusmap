define([

    'jquery'

    , 'underscore'

    //, 'scripts/config'

    //, 'scripts/moduleManager'

    //, 'eventdispatcher''

    , '_mixins'

], function ($, _) { 


    //// Constructor ////
    
    function DomManager() {

        console.info('DomManager');

        _.bindAll(this,  'getRootEl');

        this.$root = $('body');

        this.getElement = _.dispatch(this.getOptionsEl, this.getHtmlEl, this.getRootEl);

    }


    //// Methods ////
    
    DomManager.prototype.setAppRoot = function(el) {

        // Root app DOM element
        this.$root = $(el);

    };

    DomManager.prototype.cssFlag = function (name, options) {

        var action, $el;

        options || (options = {});

        $el = this.getElement(options);

        options.remove !== true ? $el.addClass(name) : $el.removeClass(name);

    };

    DomManager.prototype.getOptionsEl = function(options) {

        return options.$el;

    };
 
    DomManager.prototype.getRootEl = function(options) {

        return this.$root;

    };

    DomManager.prototype.getHtmlEl = function(options) {

        options || (options = {});

        if (options.el && options.el.toLowerCase() === 'html') return $('html');

    };

    // Defined in init so this keyword behaves
    DomManager.prototype.getElement = function() {};

    return new DomManager();

});