define([

    'underscore'

    , 'config'

    , 'scripts/panelManager'

    , '_mixins'

], function(_, Config) {

    'use strict';


    function DataTypeStrategy(_, Config, PanelManager) {

        this.type = 'truthhandler';

    }

    DataTypeStrategy.prototype.stringToBoolean = function(model, val, key, Datastore, PanelManager, theTruth) {

        var attr = {};

        if (val !== 'true' && val !== 'false') return;

        val = (val === 'true');

        attr[key] = val;

        _.extend(model, attr);

        return  val;

    };

    DataTypeStrategy.prototype.stringToInteger = function(model, val, key, Datastore, PanelManager, theTruth) {

        var attr = {};
        
        // Includes negative integers
        if (!_.isString(val) || val.match(/^-?\d+$/) === null) return;

        val = parseInt(val);

        attr[key] = val;

        _.extend(model, attr);

        return  val;

    };

    DataTypeStrategy.prototype.stringToLatLng = function(model, val, key, Datastore, PanelManager, theTruth) {

        var match, attr = {};

        if (!_.isString(val)) return;

        match = val.match(/^\s*(\-?\d+\.?(?:\d+)?),\s*(\-?\d+\.?(?:\d+)?)\s*$/);

        if (match === null || match.length !== 3) return;

        val = { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

        attr[key] = val;

        _.extend(model, attr);

        return  val;

    };

    // Incrementing/decrementing zoom level (+, -)
    DataTypeStrategy.prototype.zoomToInteger = function(model, val, key, Datastore, PanelManager, theTruth) {

        var z;

        if (key !== 'zoom' || (val !== '+' && val !== '-')) return;

        z = model.zoom;

        return  val = val === '+' ? ++z : --z;

    };

    // Convert location string ids to object references
    DataTypeStrategy.prototype.locationIdsToObjects = function(model, val, key, Datastore, PanelManager, theTruth) {

        var attr = {}, locations;

        if (key !== 'details' || !_.isString(val)) return;

        locations = theTruth.get('locations');

        attr[key] = _.find(locations, function(loc) { return _.getAttr(loc, 'locationid') === val; });

        // only update if there's a found location
        if (attr[key]) _.extend(model, attr);

        return  attr[key];

    };

    // Convert panel string ids to object references
    DataTypeStrategy.prototype.panelIdsToObjects = function(model, val, key, Datastore, PanelManager, theTruth) {

        var attr = {};
        
        if (key !== 'panels' || !_.isString(val)) return;

        // Always ensure that a change is registered on panel change.
        // temp hack
        //if (val === 'results') theTruth.set({ panels: null }, { silent: true });

        attr[key] = PanelManager.getPanelsById( val );

        _.extend(model, attr);

        return  attr[key];

    };

    DataTypeStrategy.prototype.primaryLabelDefault = function(model, val, key, Datastore, PanelManager, theTruth) {

        var attr = {};
        
        if (key !== 'primarylabel' || val !== null) return;

        attr[key] = Config.labels.primary.replace('%campus%', 'Medford/Somerville');

        _.extend(model, attr);

        return  attr[key];

    };

    DataTypeStrategy.prototype.campusIdToObject = function(model, val, key, Datastore, PanelManager, theTruth) {

        var attr = {};

        if (key !== 'campus' || !_.isString(val)) return;

        attr[key] = Datastore.getCampus( val );

        _.extend(model, attr);

        return  attr[key];

    };

    DataTypeStrategy.prototype.hoverLocationChange = function(model, val, key, Datastore, PanelManager, theTruth) {

        var attr = {}, locations;

        if (key !== 'hover' || !_.isString(val)) return;

        locations = theTruth.get('locations');

        attr[key] = _.find(locations, function(loc) { return _.getAttr(loc, 'locationid') === val; });

        // only update if there's a found location
        if (attr[key]) _.extend(model, attr);

        return  attr[key];

    };

    // Convert a backto value of true to an usable object
    DataTypeStrategy.prototype.backTo = function(model, val, key, Datastore, PanelManager, theTruth) {

        var attr = {}, panel;

        if (key !== 'backto' || !_.isString(val)) return;

        //attr[key] = { panels: theTruth.get('panels'), label: val };

        //if (attr[key]) _.extend(model, attr);
        
        return  attr[key];

    };

    DataTypeStrategy.prototype.detailsChange = function(model, val, key, Datastore, PanelManager, theTruth) {

        var navbar, navbarstate, nextItem;

        if (key !== 'details' || _.isEmpty(val)) return;

        // Only proceed if the location is the same - want to advance the navbar to next item
        if (theTruth.get('details') !== val) return;

        navbar = theTruth.get('detailsnavbar');

        navbarstate = theTruth.get('detailsnavbarstate');

        //navitemCurrent = _.find( navbar , function(navitem) { return navitem.id === navbarstate; });

        // Set a default navbar state
        if (_.isEmpty(navbarstate)) model.detailsnavbarstate = _.first(navbar).id;

        // The navbar should already have correct items hidden since we're dealing with changes to the same loc
        nextItem = _.getNext( _.reject(navbar, function(navitem) { return navitem.hide && navitem.hide === true; }), navbarstate );

        // Update the Truth with appropriate navbar state
        model.detailsnavbarstate = nextItem.id;

        return  val;

    };

    DataTypeStrategy.prototype.locationsDataIntegrity = function(model, val, key, Datastore, PanelManager, theTruth) {

        var attr = {};

        if (key !== 'locations' || !_.isArray(val)) return;

        attr[key] = _.chain(val)

                     .reject(function(loc) { return _.getAttr(loc, 'latlng') === undefined; })

                     .each(function(loc) {

                        var latlng = _.getAttr(loc, 'latlng');

                        if (_.isString(latlng)) {

                            _.setAttr(loc, { 

                                // Pass in fake model so latlng is not automatically updated on model attr
                                latlng: DataTypeStrategy.prototype.stringToLatLng.call(this, {}, latlng, 'latlng', Datastore, PanelManager)

                            });
                        }

                     })

                     .value();

        // Not needed _.extend(model, attr);

        return  val;

    };


    DataTypeStrategy.prototype.dispatch = _.dispatch( 

        DataTypeStrategy.prototype.stringToBoolean,

        DataTypeStrategy.prototype.stringToInteger,

        DataTypeStrategy.prototype.stringToLatLng,

        DataTypeStrategy.prototype.zoomToInteger,

        DataTypeStrategy.prototype.locationIdsToObjects,

        DataTypeStrategy.prototype.panelIdsToObjects,

        DataTypeStrategy.prototype.campusIdToObject,

        DataTypeStrategy.prototype.locationsDataIntegrity,

        DataTypeStrategy.prototype.primaryLabelDefault,

        DataTypeStrategy.prototype.detailsChange,

        DataTypeStrategy.prototype.hoverLocationChange,

        DataTypeStrategy.prototype.backTo

    );


    return DataTypeStrategy;

});
