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

        this.maplabelTemplate = JST['app/scripts/templates/map-label.ejs'];

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


    // Setting tile divs innerHTML seems best performance
    DomManager.prototype.createLabelHtml = function(json) {

        var html = this.template(json);

        return html;

    }

    // Html for each label tile
    DomManager.prototype.getLabelTile = function(id, ownerDocument, models) {

        var div = ownerDocument.createElement('div'), labels;

        labels = [];//_.map(models, function(loc) { return DomManager.getInstance().createLabelHtml(loc); });

        div.className = 'label-tile';

        div.innerHTML = labels.join('');

        div.style.position = 'relative';

        div.style.width = '256px';

        div.style.height = '256px';

        div.style.border = '1px #ccc solid';

        return div;

    };

    
    return new DomManager();

});