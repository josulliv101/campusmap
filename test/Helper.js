function FakePanelManager() {

	this.panels = [];

}

FakePanelManager.prototype.getPanelsById = function(ids) { 

  ids = ids.split(',');

  return _.map(ids, function(id) { return { id: id }; }); 

};

FakePanelManager.prototype.closePanels = function() { 

  return 'fake-deferred'; 

};

FakePanelManager.prototype.openPanels = function() { 

  return 'fake-deferred'; 

};



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