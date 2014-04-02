define([

    'scripts/views/panels/Base'

    , 'eventdispatcher'

], function(Base, EventDispatcher) {

    'use strict';

	return Base.extend({


	    initialize: function() {

	        Base.prototype.initialize.call(this);

	        this.location = null;

            EventDispatcher.on('delegateTruth', function(changedAttrs, previousAttrs) { 

            	var location;

            	if (!changedAttrs.details) return;

            	this.location = changedAttrs.details;

                console.log('**************', changedAttrs, previousAttrs);

                this.model.set({ 

                	location: this.location

                });

                // No need to re-render. The panel is forced close every time so will re-render before opening.
                //this.render();

            }, this);
	    }
	});
});