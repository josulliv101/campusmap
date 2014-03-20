
define([

      'scripts/domManager'

    , 'scripts/utils/MapUtils'

], function(DomManager, MapUtils) {


    'use strict';


    function LabelMapType(tileSize, MapUtils) {

      this.tileSize = tileSize;

      this.utils = MapUtils;

    }

    LabelMapType.prototype.getTile = function(coord, zoom, ownerDocument) {

      // Native innerHTML for best performance
      var locs = this.utils.getLocationsFromTileCache(coord, zoom);

      return DomManager.getLabelTile(MapUtils.getTileZoomId(coord, zoom), ownerDocument, locs);

    };
 
    return LabelMapType;

});