define([

    'underscore'

    , '_mixins'

], function(_) {

    'use strict';


    function DataTypeStrategy() {

        this.type = 'truthhandler';

    }

    DataTypeStrategy.prototype.stringToBoolean = function(model, val, key, Datastore) {

        if (val !== 'true' && val !== 'false') return;

        return  val = (val === 'true');

    };

    DataTypeStrategy.prototype.stringToInteger = function(model, val, key, Datastore) {

        // Includes negative integers
        if (!_.isString(val) || val.match(/^-?\d+$/) === null) return;

        return  val = parseInt(val);

    };

    DataTypeStrategy.prototype.stringToLatLng = function(model, val, key, Datastore) {

        var match;

        if (!_.isString(val)) return;

        match = val.match(/^\s*(\-?\d+\.?(?:\d+)?),\s*(\-?\d+\.?(?:\d+)?)\s*$/);

        if (match === null || match.length !== 3) return;

        return  val = { lat: match[1], lng: match[2]};

    };

    // Incrementing/decrementing zoom level (+, -)
    DataTypeStrategy.prototype.zoomToInteger = function(model, val, key, Datastore) {

        var z;

        if (key !== 'zoom' || (val !== '+' && val !== '-')) return;

        z = model.zoom;

        return  val = val === '+' ? ++z : --z;

    };

    // Convert location string ids to object references
    DataTypeStrategy.prototype.idsToObjects = function(model, val, key, Datastore) {

        if (key !== 'details' && !_.isString(val)) return;

        return  val = Datastore.getLocationById(val);

    };

    DataTypeStrategy.prototype.dispatch = _.dispatch( 

        DataTypeStrategy.prototype.stringToBoolean,

        DataTypeStrategy.prototype.stringToInteger,

        DataTypeStrategy.prototype.stringToLatLng,

        DataTypeStrategy.prototype.zoomToInteger,

        DataTypeStrategy.prototype.idsToObjects

    );

    return DataTypeStrategy;

});
