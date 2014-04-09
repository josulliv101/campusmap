define([

    'underscore'

    , 'config'

    , 'scripts/PanelManager'

    , '_mixins'

], function(_, Config) {

    'use strict';


    function DataTypeStrategy(_, Config, PanelManager) {

        this.type = 'truthhandler';

    }

    DataTypeStrategy.prototype.stringToBoolean = function(model, val, key, Datastore, PanelManager, theTruth) {

        if (val !== 'true' && val !== 'false') return;

        return  val = (val === 'true');

    };

    DataTypeStrategy.prototype.stringToInteger = function(model, val, key, Datastore, PanelManager, theTruth) {

        // Includes negative integers
        if (!_.isString(val) || val.match(/^-?\d+$/) === null) return;

        return  val = parseInt(val);

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

        if (key !== 'details' || !_.isString(val)) return;

        return  val = Datastore.getLocationById(val);

    };

    // Convert panel string ids to object references
    DataTypeStrategy.prototype.panelIdsToObjects = function(model, val, key, Datastore, PanelManager, theTruth) {

        var attr = {};
        
        if (key !== 'panels' || !_.isString(val)) return;

        attr[key] = PanelManager.getPanelsById( val );

        _.extend(model, attr);

        return  attr[key];

    };

    DataTypeStrategy.prototype.primaryLabelDefault = function(model, val, key, Datastore, PanelManager, theTruth) {

        var attr = {};
        
        if (key !== 'primarylabel' || !_.isEmpty(val)) return;

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

    DataTypeStrategy.prototype.detailsChange = function(model, val, key, Datastore, PanelManager, theTruth) {

        var navbar, navbarstate, nextItem;

        if (key !== 'details' || _.isEmpty(val)) return;

        // Only proceed if the location is the same
        if (theTruth.get('details') !== val) return

        navbar = theTruth.get('detailsnavbar');

        navbarstate = theTruth.get('detailsnavbarstate');

        //navitemCurrent = _.find( navbar , function(navitem) { return navitem.id === navbarstate; });

        // Set a default navbar state
        if (_.isEmpty(navbarstate)) model.detailsnavbarstate = _.first(navbar).id;

        nextItem = _.getNext( navbar, navbarstate );

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

        DataTypeStrategy.prototype.detailsChange

    );


    return DataTypeStrategy;

});
