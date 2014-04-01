function FakePanelManager() {

	this.panels = [];

	this.transition = undefined;

}

FakePanelManager.prototype.getPanelsById = function(ids) { 

  ids = ids.split(',');

  return _.map(ids, function(id) { return { id: id }; }); 

};

FakePanelManager.prototype.closePanels = function() { 

  return ['fake-deferred']; 

};

FakePanelManager.prototype.openPanels = function() { 

  return ['fake-deferred']; 

};

FakePanelManager.prototype.initialize = function() { 

  return 'fake-initialize'; 

};


function FakePanel(id) { this.id = id; }

FakePanel.prototype.open = function() {};

FakePanel.prototype.close = function() {};



function FakeDatastore() {}

FakeDatastore.prototype.getLocationById = function(id) { return { id: id }; };

FakeDatastore.prototype.getCampus = function(id) { return { id: id }; };



function FakeController() {}

FakeController.prototype.init = function() {};



function FakeMapView() {}

FakeMapView.prototype.setMapType = function(type) {};

FakeMapView.prototype.setCenter = function(latlng) {};

FakeMapView.prototype.setCursor = function(type) {};

FakeMapView.prototype.setZoom = function(level) {};

FakeMapView.prototype.renderLabelOverlay = function(level) {};


function FakeMapUtils() {}

FakeMapUtils.prototype.getLocationsFromTileCache = function() { return [ { id: 'myloc1'}, { id: 'myloc2'} ]; };

FakeMapUtils.prototype.getTileZoomId = function() { return 'fake-tile-id'; };


function FakeView() { this.$el = $('<div><div class="panel"></div></div>'); }

FakeView.prototype.$ = function() { return this.$el.find('.panel'); }



function FakeModel() { this.state = ""; }

FakeModel.prototype.get = function(attr) { return this.state; };

FakeModel.prototype.set = function(attr, val) { this.state = val; };

FakeModel.prototype.trigger = function() {};
