define([

    '_mixins'
	
    , 'scripts/modernizr'

], function (_, FeatureDetector) { 

    var getViewportSize_ = _.dispatch( isMobile, isTablet, isDesktop ),

        getVizPath_ = _.dispatch(  isVizForced, isVizDirectory, isVizMap );//isVizForced,


    function parseQueryString_( queryString ) {

        var params = {}, queries, temp, i, l;
        
        if (queryString.indexOf('?') === 0) queryString = queryString.substring(1); 

        // Split into key/value pairs
        queries = queryString.split("&");
     
        // Convert the array of strings into an object
        for ( i = 0, l = queries.length; i < l; i++ ) {

            temp = queries[i].split('=');

            params[temp[0]] = temp[1];

        }
        
        return modules_(params);
    }

    function modules_( obj ) {

        var i, len, pairs, ret = {};

        if (obj.modules === undefined) return;

        pairs = obj.modules.split(',');

        for ( i = 0, len = pairs.length; i < len; i++ ) {
            
            var pair = pairs[i].split('|');

            if (pair.length === 2) ret[pair[0]] = pair[1];

        }

        return ret;

    }

    function getLocation_(success, fail) {

        success || (success = function(){});

        fail || (fail = function(){});

        if (Modernizr.geolocation) {

            navigator.geolocation.getCurrentPosition(success, fail);

        }

    }

    function isMobile() {

        // Is viewport bigger than 660px
        if (Modernizr.mq('only screen and (min-width: 661px)')) return;

        return 'mobile';

    }

    function isTablet() {

        // Is viewport small than 660px
        if (Modernizr.mq('only screen and (max-width: 660px)')) return;

        // Is viewport bigger than 1024px
        if (Modernizr.mq('only screen and (min-width: 1025px)')) return;

        return 'tablet';

    }

    function isDesktop() {

        if (Modernizr.mq('only screen and (max-width: 1024px)')) return;

        return 'desktop';

    }

    function isVizDirectory() {

        if (getViewportSize_() === 'mobile') return './scripts/services/map/directory';

    }

    function isVizMap() {

        if (getViewportSize_() === 'tablet') return 'leaflet';

        return 'googlemap';

    }

    function isVizForced(truth) {

        if (truth && truth['vizpath!']) return truth['vizpath!'];

    }

// Don't think this is needed anymore? delete
    function getOverrides_(q) { 

        var modules = {};

        console.log('q', q);

        if (q !== undefined) modules = parseQueryString_(q) || {};

        if (modules.animation) return modules;

        // Forcing a module via querystring params takes precedence over feature detection tweaks
        if (modules.animation === undefined && Modernizr.cssanimations === true) modules.animation = 'animationCSS';

        else modules.animation = 'animation';

console.log('modules.animation', modules.animation);

        console.log('modules', modules, Modernizr.cssanimations );

        return modules;

    }

	return {

        // The first one that returns a value is the viewport size
        getViewportSize: getViewportSize_,

        getVizPath: getVizPath_,

		getOverrides: getOverrides_,

        getLocation: getLocation_,

        setPathsMap: function(require) {

            var mappings = getOverrides_();

            console.log('mappings', mappings.animation);

            require.config({

                // '*' signifies that these mappings should be used everywhere (all modules)
                map: { '*':  mappings  }

            });

        }

	} 
});