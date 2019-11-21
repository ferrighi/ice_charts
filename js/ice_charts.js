// WGS 84 / UPS North (N,E)
proj4.defs('EPSG:32661', '+proj=stere +lat_0=90 +lat_ts=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m +no_defs');
var proj32661 = ol.proj.get('EPSG:32661');
var ex32661 = [-4e+06,-6e+06,8e+06,8e+06];
proj32661.setExtent(ex32661);
ol.proj.addProjection(proj32661);

var ext = ex32661;
var prj = proj32661;
var defzoom = 4;

// Import variables from php: array(address, id, layers)
var prinfoQ1 = Drupal.settings.prinfoQ1;

var layer = {};

// Base layer WMS
layer['base']  = new ol.layer.Tile({
   type: 'base',
   source: new ol.source.TileWMS({ 
       url: 'http://public-wms.met.no/backgroundmaps/northpole.map',
       params: {'LAYERS': 'world', 'TRANSPARENT':'false', 'VERSION':'1.1.1','FORMAT':'image/png', 'SRS':prj}
   })
});

// Border layer WMS
layer['border']  = new ol.layer.Tile({
   source: new ol.source.TileWMS({
       url: 'http://public-wms.met.no/backgroundmaps/northpole.map',
       params: {'LAYERS': 'borders', 'TRANSPARENT':'true', 'VERSION':'1.1.1','FORMAT':'image/png', 'SRS':prj}
   })
});


layer['ic']  = new ol.layer.Tile({
       title: '2010-11-04',
       source: new ol.source.TileWMS({
       url: "http://thredds.met.no/thredds/wms/sea_ice/SIW-METNO-ARC-SEAICE_HR-OBS/ice_conc_svalbard_aggregated?version%3D1.3.0",
       params: {'LAYERS': 'ice_concentration', 
                'TRANSPARENT':'true', 
                'FORMAT':'image/png', 
                'TIME':"2010-11-04T14:00:00.000Z",
                'CRS':'EPSG:32661', 
                'VERSION':'1.3.0', 
                'SERVICE':'WMS',
                'REQUEST':'GetMap',
                'TILE':'true','WIDTH':'256','HEIGHT':'256'}
   })
});

//2010-01-04T14:00:00.000Z,2010-01-05T14:00:00.000Z,2010-01-06T14:00:00.000Z,2010-01-07T14:00:00.000Z,2010-01-08T14:00:00.000Z,2010-01-11T14:00:00.000Z,2010-01-12T14:00:00.000Z,2010-01-13T14:00:00
layer['ic2']  = new ol.layer.Tile({
       title: '2010-01-13',
       source: new ol.source.TileWMS({
       url: "http://thredds.met.no/thredds/wms/sea_ice/SIW-METNO-ARC-SEAICE_HR-OBS/ice_conc_svalbard_aggregated?version%3D1.3.0",
       params: {'LAYERS': 'ice_concentration', 
                'TRANSPARENT':'true', 
                'FORMAT':'image/png', 
                'TIME':"2010-01-13T14:00:00.000Z",
                'CRS':'EPSG:32661', 
                'VERSION':'1.3.0', 
                'SERVICE':'WMS',
                'REQUEST':'GetMap',
                'TILE':'true','WIDTH':'256','HEIGHT':'256'}
   })
});


// build up the map 
var centerLonLat1 = [15, 80];
var centerTrans1 = ol.proj.transform(centerLonLat1, "EPSG:4326",  prj);

var map = new ol.Map({
   controls: ol.control.defaults().extend([
      new ol.control.FullScreen()
   ]),
   target: 'map',
   layers: [ layer['base'],
             layer['ic'],
             layer['ic2']
           ],
   view: new ol.View({
                 zoom: 4, 
                 minZoom: 3,
                 maxZoom: 7,
                 center: centerTrans1,
                 projection: prj
   })
});

//Layer switcher
var layerSwitcher = new ol.control.LayerSwitcher({});
map.addControl(layerSwitcher);

//Mouseposition
var mousePositionControl = new ol.control.MousePosition({
   coordinateFormat : function(co) {
      return ol.coordinate.format(co, template = 'lon: {x}, lat: {y}', 2);
   },
   projection : 'EPSG:4326',
});
map.addControl(mousePositionControl);

//Layer switcher
//var lswitcher = new ol.control.LayerSwitcher({targer:$(".layerSwithcer").get(0),});
var lswitcher = new ol.control.LayerSwitcher({});
map.addControl(lswitcher);

//Mouseposition
var mousePositionControl = new ol.control.MousePosition({
   coordinateFormat : function(co) {
      return ol.coordinate.format(co, template = 'lon: {x}, lat: {y}', 2);
   },
   projection : 'EPSG:4326', 
});
map.addControl(mousePositionControl);



