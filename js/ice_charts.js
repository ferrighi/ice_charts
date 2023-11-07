(function($, Drupal, once) {
    Drupal.behaviors.iceChartClient = {
      attach: function(context) {
        const mapEl = $(once('#map', '[data-ice-map]', context));
        mapEl.each(function () {

        //$('#map', context).each(function() {
          console.log("Beginning of ice_charts.js");

          //Initialize the date slider
          var sliderStartDay = Math.floor(new Date("2010-01-04T14:00:00.000Z") / 8.64e7).toString();
          var nowOrYester = new Date();
          if (nowOrYester.getUTCHours() < 14) {
            nowOrYester.setUTCDate(nowOrYester.getUTCDate() - 1);
          }
          var sliderEndDay = Math.floor(nowOrYester / 8.64e7).toString();

          $('#dateSlider').append(
            $(document.createElement('input')).prop({
              id: 'ic-slider',
              type: 'range',
              min: sliderStartDay,
              max: sliderEndDay,
              value: sliderEndDay,
            }));
          /*
          document.write("<input id=\"ic-slider\" type=\"range\" min=\"" +
            sliderStartDay + "\" max=\"" + sliderEndDay +
            "\" value=\"" + sliderEndDay + "\" />");
            */
          function datepicker_onchange(newDate) {
            var new_day = Math.floor(newDate / 8.64e7).toString();
            if ($("#ic-slider").val() != new_day) {
              $("#ic-slider").val(new_day);
              $("#ic-slider").trigger("change");
            }
          }

          proj4.defs('EPSG:32661', '+proj=stere +lat_0=90 +lat_ts=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m +no_defs');
          ol.proj.proj4.register(proj4);

          var proj32661 = new ol.proj.Projection({
            code: 'EPSG:32661',
            extent: [-4e+06, -6e+06, 8e+06, 8e+06]
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
          layer['base'] = new ol.layer.Tile({
            type: 'base',
            source: new ol.source.TileWMS({
              url: 'https://public-wms.met.no/backgroundmaps/northpole.map',
              params: {
                'LAYERS': 'world',
                'TRANSPARENT': 'true',
                'VERSION': '1.1.1',
                'FORMAT': 'image/png',
                'SRS': prj
              }
            })
          });

          // Border layer WMS
          layer['border'] = new ol.layer.Tile({
            source: new ol.source.TileWMS({
              url: 'https://public-wms.met.no/backgroundmaps/northpole.map',
              params: {
                'LAYERS': 'borders',
                'TRANSPARENT': 'true',
                'VERSION': '1.1.1',
                'FORMAT': 'image/png',
                'SRS': prj
              }
            })
          });

          var initiallySelectedDate = getSelectedDateFromSliderValue(parseInt($('#ic-slider').val()));
          //alert(initiallySelectedDate);
          layer['ic'] = new ol.layer.Tile({
            source: new ol.source.TileWMS({
              url: "https://thredds.met.no/thredds/wms/sea_ice/SIW-METNO-ARC-SEAICE_HR-OBS/ice_conc_svalbard_aggregated?version%3D1.3.0",
              params: {
                'LAYERS': 'ice_concentration',
                'TRANSPARENT': 'true',
                'FORMAT': 'image/png',
                'TIME': initiallySelectedDate.toISOString(),
                'CRS': 'EPSG:32661',
                'VERSION': '1.3.0',
                'SERVICE': 'WMS',
                'REQUEST': 'GetMap',
                'STYLES': 'boxfill/wmo_ice_chart',
                'TILE': 'true',
                'WIDTH': '256',
                'HEIGHT': '256'
              }
            })
          });

          // build up the map
          var centerLonLat1 = [15, 78];
          var centerTrans1 = ol.proj.transform(centerLonLat1, "EPSG:4326", prj);

          var map = new ol.Map({
            controls: ol.control.defaults().extend([
              new ol.control.FullScreen()
            ]),
            target: 'map',
            layers: [layer['ic'],
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


          function printDate(selectedDate, layer) {

            var comment = '';
            if (selectedDate.getDay() == 0 || selectedDate.getDay() == 6) {
              comment = ' <strong>Ice charts are not produced during weekends</strong>';
              //layer.setVisible(false);
            } else {
              //layer.setVisible(true);
            }
            //document.getElementById('boxDate').innerHTML = selectedDate.toISOString()+comment;
            $('#boxDate').html(comment);
            //document.getElementById('boxDate').innerHTML = comment;
          }

          printDate(initiallySelectedDate, layer['ic']);

          // inside this function "this" = document.getElementById('ic-slider')
          $('#ic-slider').on('change',function(event) {
            var newSelectedDate = getSelectedDateFromSliderValue(parseInt(this.value));
            layer['ic'].getSource().updateParams({
              'TIME': newSelectedDate.toISOString()
            });
            layer['ic'].getSource().refresh();
            $('#datepicker').datepicker("setDate", newSelectedDate.toISOString());
            printDate(newSelectedDate, layer['ic']);
          });

          //Mouseposition
          var mousePositionControl = new ol.control.MousePosition({
            coordinateFormat: function(co) {
              return ol.coordinate.format(co, template = 'lon: {x}, lat: {y}', 2);
            },
            projection: 'EPSG:4326',
          });
          map.addControl(mousePositionControl);



          $("#datepicker").datepicker({
            dateFormat: "yy-mm-ddT14:00:00.000Z"
          });
          var fill_picker = new Date(parseInt($("#ic-slider").val()) * 8.64e7);
          fill_picker.setUTCHours(14);
          $("#datepicker").datepicker("setDate", fill_picker);
          $("#datepicker").on("change", function() {
            datepicker_onchange(new Date(this.value));
          });

          $(".next-day").on("click", function() {
            var date = new Date($("#datepicker").val());
            date.setDate(date.getDate() + 1)
            $("#datepicker").datepicker("setDate", date);
            datepicker_onchange(date);
          });
          $(".next-month").on("click", function() {
            var date = new Date($("#datepicker").val());
            date.setMonth(date.getMonth() + 1);
            $("#datepicker").datepicker("setDate", date);
            datepicker_onchange(date);
          });
          $(".prev-day").on("click", function() {
            var date = new Date($("#datepicker").val());
            date.setDate(date.getDate() - 1)
            $("#datepicker").datepicker("setDate", date);
            datepicker_onchange(date);
          });
          $(".prev-month").on("click", function() {
            var date = new Date($("#datepicker").val());
            date.setMonth(date.getMonth() - 1);
            $("#datepicker").datepicker("setDate", date);
            datepicker_onchange(date);
          });

        });
      }
    };

})(jQuery, Drupal, once);
