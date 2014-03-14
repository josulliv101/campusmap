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
