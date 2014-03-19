define([

    'jquery'

    , 'underscore'

    //, 'scripts/config'

    //, 'scripts/moduleManager'

    //, 'eventdispatcher''

    , 'templates'

    , '_mixins'


], function ($, _, JST) { 


    //// Constructor ////
    
    function DomManager() {

        _.bindAll(this,  'getRootEl');

        this.$root = $('body');

        this.getElement = _.dispatch(this.getOptionsEl, this.getHtmlEl, this.getRootEl);

        this.labelTileTemplate = JST['app/scripts/templates/map-tile.ejs'];

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


    // Html for each label tile
    DomManager.prototype.getLabelTile = function(id, ownerDocument, models) {

        var html = this.labelTileTemplate({ locations: models }),

            $div = $(html);

        return $div[0];

    };

    
    return new DomManager();

});