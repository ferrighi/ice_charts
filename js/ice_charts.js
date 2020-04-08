proj4.defs('EPSG:32661', '+proj=stere +lat_0=90 +lat_ts=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m +no_defs');
ol.proj.proj4.register(proj4);

var proj32661 = new ol.proj.Projection({
  code: 'EPSG:32661',
  extent: [-4e+06,-6e+06,8e+06,8e+06]
});

var prj = proj32661;

// Import variables from php: array(address, id, layers)
//var prinfoQ1 = Drupal.settings.prinfoQ1;

function getSelectedDateFromSliderValue(sliderValue) {

  // 1970-01-01:00:00:00Z
  var selectedDate = new Date(0);
  selectedDate.setUTCDate(selectedDate.getUTCDate() + sliderValue);
  
  selectedDate.setUTCHours(14);
  return selectedDate;
}

var layer = {};

// Base layer WMS
layer['base']  = new ol.layer.Tile({
   type: 'base',
   source: new ol.source.TileWMS({ 
       url: 'http://public-wms.met.no/backgroundmaps/northpole.map',
       params: {'LAYERS': 'world', 'TRANSPARENT':'true', 'VERSION':'1.1.1','FORMAT':'image/png', 'SRS':prj}
   })
});

// Border layer WMS
layer['border']  = new ol.layer.Tile({
   source: new ol.source.TileWMS({
       url: 'http://public-wms.met.no/backgroundmaps/northpole.map',
       params: {'LAYERS': 'borders', 'TRANSPARENT':'true', 'VERSION':'1.1.1','FORMAT':'image/png', 'SRS':prj}
   })
});

var initiallySelectedDate = getSelectedDateFromSliderValue(parseInt(document.getElementById('ic-slider').value)); 

layer['ic']  = new ol.layer.Tile({
       source: new ol.source.TileWMS({
       url: "https://thredds.met.no/thredds/wms/sea_ice/SIW-METNO-ARC-SEAICE_HR-OBS/ice_conc_svalbard_aggregated?version%3D1.3.0",
       params: {'LAYERS': 'ice_concentration', 
                'TRANSPARENT':'true', 
                'FORMAT':'image/png', 
                'TIME': initiallySelectedDate.toISOString(),
                'CRS':'EPSG:32661', 
                'VERSION':'1.3.0', 
                'SERVICE':'WMS',
                'REQUEST':'GetMap',
	        'STYLES': 'boxfill/wmo_ice_chart',
                'TILE':'true','WIDTH':'256','HEIGHT':'256'}
   })
});

// build up the map 
var centerLonLat1 = [15, 73];
var centerTrans1 = ol.proj.transform(centerLonLat1, "EPSG:4326",  prj);

var map = new ol.Map({
   controls: ol.control.defaults().extend([
      new ol.control.FullScreen()
   ]),
   target: 'map',
   layers: [ layer['ic'],
             layer['base']
           ],
   view: new ol.View({
                 zoom: 3, 
                 minZoom: 1,
                 maxZoom: 7,
                 center: centerTrans1,
                 projection: prj
   })
});


function printDate(selectedDate, layer){

  var comment = '';
  if (selectedDate.getDay() == 0 || selectedDate.getDay() == 6){
    comment = ' <strong>Ice charts are not produced during weekends</strong>';
    //layer.setVisible(false);
  }else{
    //layer.setVisible(true);
  }
  //document.getElementById('boxDate').innerHTML = selectedDate.toISOString()+comment;
  document.getElementById('boxDate').innerHTML = comment;
}

printDate(initiallySelectedDate, layer['ic']);

// inside this function "this" = document.getElementById('ic-slider')
document.getElementById('ic-slider').onchange = function(event){
  var newSelectedDate = getSelectedDateFromSliderValue(parseInt(this.value));
  layer['ic'].getSource().updateParams({'TIME': newSelectedDate.toISOString()});
  layer['ic'].getSource().refresh();
  jQuery('#datepicker').datepicker("setDate",newSelectedDate.toISOString());
  printDate(newSelectedDate, layer['ic']);
}

//Mouseposition
var mousePositionControl = new ol.control.MousePosition({
   coordinateFormat : function(co) {
      return ol.coordinate.format(co, template = 'lon: {x}, lat: {y}', 2);
   },
   projection : 'EPSG:4326',
});
map.addControl(mousePositionControl);

