define([

    'underscore'

    , '_mixins'

], function(_) {

    'use strict';


    function DataTypeStrategy() {

        this.type = 'truthhandler';

    }

    DataTypeStrategy.prototype.stringToBoolean = function(model, val, key) {

        if (val !== 'true' && val !== 'false') return;

        return  val = (val === 'true');

    };

    DataTypeStrategy.prototype.stringToInteger = function(model, val, key) {

        // Includes negative integers
        if (!_.isString(val) || val.match(/^-?\d+$/) === null) return;

        return  val = parseInt(val);

    };

    DataTypeStrategy.prototype.dispatch = _.dispatch( 

        DataTypeStrategy.prototype.stringToBoolean,

        DataTypeStrategy.prototype.stringToInteger

    );

    return DataTypeStrategy;

});
