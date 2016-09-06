var map;
var apikey = "261bbc94c8266573016ba9454127b905b931b0a6";
var user = 'samuel';
var sublayers = [];

function init() {
    // var testMap;
    // var editor;
        // map = new L.Map('cartodb-map', {
            // center: [45,4],
            // zoom: 5,
            // attributionControl: false,
            // layers: [Esri_NatGeoWorldMap,Stamen_TonerLines]
          // });
        // L.control.layers([Esri_WorldPhysical]).addTo(map);
       // cartodb.createLayer(map, 'https://samueldeschampsberger.cartodb.com/api/v2/viz/55491dc2-3d03-11e5-a85a-0e4fddd5de28/viz.json')
        // .addTo(map)
        // .done(function(layer) {
            // layer.setZIndex(1);
            // var sublayer = layer.getSubLayer(0);
            // sublayers.push(sublayer);
          
        // }	);
        // map.options.minZoom = 2;
        
        
        // ----------------------------------------------------------------------------------------------------------------------------------------------
        
        var mapConfig = {
        'layers': [{
          'type': 'cartodb',
          'options': {
            'cartocss_version': '2.1.1',
            'cartocss': '#layer { polygon-fill: #F00; }',
            'sql': 'SELECT * FROM maisons'
          }
        }]
        };

        var cartoDBSource = new ol.source.CartoDB({
        account: 'samueldeschampsberger',
        config: mapConfig
        });
        var cartoDBLayer = new ol.layer.Tile({
            source: cartoDBSource
          })
        var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          cartoDBLayer
        ],
        target: 'cartodb-map',
        view: new ol.View({
          center: ol.proj.fromLonLat([6.5688, 45.48978]),
          zoom: 16
        })
        });
        
            var extent = [977450.622600, 6492347.685738, 979924.444146, 6495803.182500];
            var imgWidth = 9945;
            var imgHeight = 6846;
            var url = 'C:\\Users\\SDeschamps-berger\\Desktop\\perso\\projet carto\\genea\\git depot\\tiles\\mtft_1728\\mtft_1728_tiles\\_alllayers';
            var crossOrigin = 'anonymous';
            
        
        //var extent = map.layers[1].getSource().getExtent();
        //map.getView().fit(extent, map.getSize());

        // function setArea(n) {
        // mapConfig.layers[0].options.sql =
            // 'select * from european_countries_e where area > ' + n;
        // cartoDBSource.setConfig(mapConfig);
        // }


        //document.getElementById('country-area').addEventListener('change', function() {
        //setArea(this.value);
        //});
}