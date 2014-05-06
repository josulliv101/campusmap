define([

    'jquery'

    , 'underscore'

    //, 'scripts/config'

    //, 'scripts/moduleManager'

    , 'eventdispatcher'

    , 'templates'

    , '_mixins'


], function ($, _, EventDispatcher, JST) { 


    //// Constructor ////
    
    function DomManager() {

        _.bindAll(this,  'getRootEl');

        this.$root = $('body');

        this.getElement = _.dispatch(this.getOptionsEl, this.getHtmlEl, this.getRootEl);

        this.labelTileTemplate = JST['app/scripts/templates/map-tile.ejs'];

        // Listen for clicks from elements with a 'data'cmd' attribute, and forward to router
        $('body').on('click', '[data-campusmap]', function(ev) {

            var data = $(this).data('campusmap');

            console.log('data-campusmap', _.stringToObject(data));

            // In case the element happens to be a link
            ev.preventDefault();

            // These will fisrt pass through the App Controller so the Truth can stay up-to-date
            EventDispatcher.trigger('truthupdate', _.stringToObject(data));

            // Must return false as well to keep Router Back Button integration working
            return false;

        });

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

    DomManager.prototype.unfocusAll = function(options) {

        $(':focus').focusout().blur();

    };

    DomManager.prototype.getDimensions = function($el) {

        if (!$el) return { x: 0, y: 0 };

        return { width: $el.outerWidth(), height: $el.outerHeight() };

    };

    // Html for each label tile
    DomManager.prototype.getLabelTile = function(id, ownerDocument, models) {

        var html, $div;

        _.each(models, function(model) { 

            _.setAttr(model, { classnames: this.getLocationClassNames(model) }); 

        }, this);

        html = this.labelTileTemplate({ locations: _.map(models, function(model) { return model.toJSON ? model.toJSON() : model; }) });

        $div = $(html);

        return $div[0];

    };


    DomManager.prototype.getLocationClassNames = function(loc) {

        var classes = ['location'], tags;

        if (!loc)  return'';

        tags = _.getAttr(loc, 'tags');

//// Refactor This ////

        // Don't want to change tags string attr -- needed as string for persistance.
        if (_.isString(tags)) loc.tagItems = loc.tagItems || _.chain(_.getAttr(loc, 'tags').split(',')).map(_.trim).value();

        if (_.getAttr(loc, 'emphasis')) classes.push('emphasis' + _.getAttr(loc, 'emphasis'));

        if (_.getAttr(loc, 'hide') === true) classes.push('hide');

        if (_.getAttr(loc, 'isCloseBy') === true) classes.push('closeby');

        if (_.getAttr(loc, 'isHovered') === true) classes.push('hover');

        if (_.getAttr(loc, 'isDetails') === true) classes.push('details');

        // Accessibility
        if (_.contains(loc.tagItems, 'accessible-full')) classes.push('accessible-full');

        if (_.contains(loc.tagItems, 'accessible-assistance')) classes.push('accessible-assistance');

        if (_.contains(loc.tagItems, 'accessible-restroom')) classes.push('accessible-restroom');

        // Tag-based css flags
        if (_.contains(loc.tagItems, 'parking')) classes.push('parking');

        if (_.contains(loc.tagItems, 'field')) classes.push('field');

        if (_.contains(loc.tagItems, 'lawn')) classes.push('lawn');

        if (_.contains(loc.tagItems, 'commencement')) classes.push('commencement');

        if (_.contains(loc.tagItems, 'restroom')) classes.push('restroom');

        if (_.contains(loc.tagItems, 'disabled-dropoff')) classes.push('disabled-dropoff');

        if (_.contains(loc.tagItems, 'food-service')) classes.push('food-service');

        if (_.contains(loc.tagItems, 'shuttle')) classes.push('shuttle');

        if (_.contains(loc.tagItems, 'restroom-disabled')) classes.push('restroom-disabled');

        if (_.contains(loc.tagItems, 'first-aid'))  {

            classes.push('first-aid');

            //classes.push('emphasis5');

        }

        if (_.contains(loc.tagItems, 'graduation-ceremony'))  {

            classes.push('graduation-ceremony');

            //classes.push('emphasis5');

        }

        if (_.contains(loc.tagItems, 'info-booth'))  {

            classes.push('info-booth');

            //classes.push('emphasis5');

        }

        if (_.contains(loc.tagItems, 'web viewing area'))  {

            classes.push('web-viewing-area');

            //classes.push('emphasis5');

        }

        return classes.join(" ");

    };

    
    return new DomManager();

});