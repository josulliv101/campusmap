
define([

  '../../scripts/utils/MapUtils'

], function (MapUtils) {

	describe('MapUtils Tests', function () {


		beforeEach(function() {

			MapUtils.resetCache();

		});

		afterEach(function(){

		});

		describe('Basic', function () {

			it('should exist', function () {

				expect( MapUtils ).toBeDefined();

			});

			it('should be able to create a Point', function () {

				var point = MapUtils.point();

				expect( point.x ).toBe(0);

				expect( point.y ).toBe(0);

			});

			it('should be able to create a Point specifying x and y values', function () {

				var point = MapUtils.point(100, 120);

				expect( point.x ).toBe(100);

				expect( point.y ).toBe(120);

			});

		});

		describe('Conversions', function () {

			it('should convert a lat/lng to a point', function () {

				var latlng = { lat: 42.403686, lng: -71.120338 },

					point = MapUtils.latLngToWorldPoint(latlng);

				expect( point ).toBeDefined();

			});


			it('should convert a world point to lat/lng', function () {

				var point = { x: 77.42553742222222, y: 94.64404255574121 },

					latlng = MapUtils.worldPointToLatLng(point);

				expect( latlng.lat ).toBe(42.403686);

				expect( latlng.lng ).toBe(-71.120338);

			});

			it('should convert a world point to px coord', function () {

				var point = { x: 77.42553742222222, y: 94.64404255574121 },

					pxCoord = MapUtils.worldPointToPixelCoordinate(point, 17);

				expect( pxCoord.x ).toBe(10148320.04100551);

				expect( pxCoord.y ).toBe(12405183.945866112);

			});

			it('should convert a px coord to world point', function () {

				var pxCoord = { x: 10148320.04100551, y: 12405183.945866112 },

					worldPoint = MapUtils.pixelCoordinateToWorldPoint(pxCoord, 17);
					
				expect( worldPoint.x ).toBe(77.42553742222222);

				expect( worldPoint.y ).toBe(94.64404255574121);

			});

			it('should offset a latlng by certain number of pixels', function () {

				var latlng = { lat: 42.403686, lng: -71.120338 },

				  newlatLng = MapUtils.offsetLatLngByPixels(latlng, 17, { x: 100, y: 100 });

				expect( newlatLng.lat ).toBe(42.404478225083665);

				expect( newlatLng.lng ).toBe(-71.12141088360596);

			});

			it('should convert a lat/lng to a tile', function () {

				var latlng = { lat: 42.403686, lng: -71.120338 },

					tileOffset1 = MapUtils.latLngToTileOffset(latlng, 17),

					tileOffset2 = MapUtils.latLngToTileOffset(latlng, 15);

				expect( tileOffset1 ).toBeDefined();

				expect( tileOffset2 ).toBeDefined();

			});

			it('should have a tile x/y, zoom and offset defined for a tileOffset', function () {

				var latlng = { lat: 42.403686, lng: -71.120338 },

					tileOffset = MapUtils.latLngToTileOffset(latlng, 17);

				expect( tileOffset.tile.x ).toBeDefined();

				expect( tileOffset.tile.y ).toBeDefined();

				expect( tileOffset.zoom ).toBeDefined();

				expect( tileOffset.offset.x ).toBeDefined();

				expect( tileOffset.offset.y ).toBeDefined();

			});

			it('should get the length between 2 points', function () {

				var p1 = { x: 0, y: 0 }, 

					p2 = { x: 4, y: 3 },

					len1 = MapUtils.getLength(p1, p2),

					len2 = MapUtils.getLength(p2, p1);

				expect( len1 ).toBe(5);

				expect( len2 ).toBe(5);

			});

			it('should tell if a latlng is within a certain px radius of another point', function () {

				var center = { lat: 42.40714, lng: -71.12134 }, // Gifford House

					far = { lat: 42.40687, lng: -71.11995 },

					close = { lat: 42.40708, lng: -71.12125 },

					zoom = 18,

					test1 = MapUtils.isWithinRadius(center, close, zoom, 60),

					test2 = MapUtils.isWithinRadius(center, far, zoom, 60),

					test3 = MapUtils.isWithinRadius(center, far, zoom, 999);

				expect( test1 ).toBe(true);

				expect( test2 ).toBe(false);

				expect( test3 ).toBe(true);

			});

		});

		describe('Cache', function () {

			it('should add a location to the tile cache', function () {

				var latlng = { lat: 42.403686, lng: -71.120338 },

					tileOffset = MapUtils.latLngToTileOffset(latlng, 17),

					cache = MapUtils.getTileCache();

				MapUtils.addLocationToTileCache(tileOffset, { locationid: 'myloc1' });

				expect( _.size(cache) ).toBe(1);

			});

			it('should store different lat/lngs in different spots in cache when just zoom is different', function () {

				var latlng1 = { lat: 42.403686, lng: -71.120338 },

					latlng2 = { lat: 42.403686, lng: -71.120338 },

					tileOffset1 = MapUtils.latLngToTileOffset(latlng1, 17),

					tileOffset2 = MapUtils.latLngToTileOffset(latlng2, 16),

					cache = MapUtils.getTileCache();

				MapUtils.addLocationToTileCache(tileOffset1, { locationid: 'myloc1' });

				MapUtils.addLocationToTileCache(tileOffset2, { locationid: 'myloc2' });

				expect( _.size(cache) ).toBe(2);

			});

			it('should store different lat/lngs in different spots in cache when just zoom is same, but coords are different', function () {

				var latlng1 = { lat: 42.49686, lng: -71.180338 },

					latlng2 = { lat: 42.403686, lng: -71.120338 },

					tileOffset1 = MapUtils.latLngToTileOffset(latlng1, 17),

					tileOffset2 = MapUtils.latLngToTileOffset(latlng2, 17),

					cache = MapUtils.getTileCache();

				MapUtils.addLocationToTileCache(tileOffset1, { locationid: 'myloc1' });

				MapUtils.addLocationToTileCache(tileOffset2, { locationid: 'myloc2' });

				expect( _.size(cache) ).toBe(2);

			});

			it('should store different lat/lngs in same spots in cache when just zoom is same, coords fall on same tile', function () {

				var latlng1 = { lat: 42.49686, lng: -71.180338 },

					latlng2 = { lat: 42.49686, lng: -71.180348 },

					tileOffset1 = MapUtils.latLngToTileOffset(latlng1, 17),

					tileOffset2 = MapUtils.latLngToTileOffset(latlng2, 17),

					cache = MapUtils.getTileCache();

				MapUtils.addLocationToTileCache(tileOffset1, { locationid: 'myloc1' });

				MapUtils.addLocationToTileCache(tileOffset2, { locationid: 'myloc2' });

				expect( _.size(cache) ).toBe(1);

			});

			it('should get locations from the tile cache', function () {

				var latlng1 = { lat: 42.49686, lng: -71.180338 },

					latlng2 = { lat: 42.49686, lng: -71.180348 },

					latlng3 = { lat: 32.49686, lng: -71.180348 },

					tileOffset1 = MapUtils.latLngToTileOffset(latlng1, 17),

					tileOffset2 = MapUtils.latLngToTileOffset(latlng2, 17),

					tileOffset3 = MapUtils.latLngToTileOffset(latlng3, 17),

					cache = MapUtils.getTileCache(), locs;

				MapUtils.addLocationToTileCache(tileOffset1, { locationid: 'myloc1' });

				MapUtils.addLocationToTileCache(tileOffset2, { locationid: 'myloc2' });

				MapUtils.addLocationToTileCache(tileOffset3, { locationid: 'far away myloc3' });

				locs = MapUtils.getLocationsFromTileCache(tileOffset1.tile, tileOffset1.zoom);

				expect( locs.length ).toBe(2);

			});

			it('should get close by locations from the tile cache', function () {

				var latlng1 = { lat: 42.49686, lng: -71.180338 },

					latlng2 = { lat: 42.49686, lng: -71.180348 },

					latlng3 = { lat: 42.49686, lng: -71.177048 },

					latlng4 = { lat: 40.49686, lng: -71.177048 },

					tileOffset1 = MapUtils.latLngToTileOffset(latlng1, 17),

					tileOffset2 = MapUtils.latLngToTileOffset(latlng2, 17),

					tileOffset3 = MapUtils.latLngToTileOffset(latlng3, 17),

					tileOffset4 = MapUtils.latLngToTileOffset(latlng4, 17),

					cache = MapUtils.getTileCache(), locs;

					

				MapUtils.addLocationToTileCache(tileOffset1, { locationid: 'myloc1' });

				MapUtils.addLocationToTileCache(tileOffset2, { locationid: 'myloc2' });

				MapUtils.addLocationToTileCache(tileOffset3, { locationid: 'far away myloc3' });

				MapUtils.addLocationToTileCache(tileOffset4, { locationid: 'far away myloc4' });

				locs = MapUtils.getCloseByLocationsFromTileCache(tileOffset1.tile, tileOffset1.zoom);

				expect( locs.length ).toBe(3);

			});

			it('should compare 2 tiles -- x/y coords', function () {

				var tile1 = { x: 10, y: 10 },

					tile2 = { x: 11, y: 10 },

					tile3 = { x: 10, y: 9 },

					tile4 = { x: 15, y: 5 };

				expect( MapUtils.compareTiles(tile1, tile1) ).toEqual({ x: 0, y: 0 });

				expect( MapUtils.compareTiles(tile1, tile2) ).toEqual({ x: 1, y: 0 });

				expect( MapUtils.compareTiles(tile2, tile1) ).toEqual({ x: -1, y: 0 });

				expect( MapUtils.compareTiles(tile1, tile3) ).toEqual({ x: 0, y: -1 });

				expect( MapUtils.compareTiles(tile4, tile1) ).toEqual({ x: -5, y: 5 });

			});

		});

	});

});
