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
        
        // Base Layers : 
        var baseLayers = new ol.layer.Group(
            {   title: 'fond de plan',
            openInLayerSwitcher: true,
            layers:
                [// new ol.layer.Tile(
                    // {	title: "Watercolor",
                        // baseLayer: true,
                        // source: new ol.source.Stamen({
                        // layer: 'watercolor',
                        // visible: false
                      // })
                    // }),
                // new ol.layer.Tile(
                    // {	title: "Toner",
                        // baseLayer: true,
                        // visible: false,
                        // source: new ol.source.Stamen({
                        // layer: 'toner'
                      // })
                    // }),
                new ol.layer.Tile(
                    {	title: "OSM",
                        baseLayer: true,
                        source: new ol.source.OSM(),
                        visible: true
                    })
                ]
        });

        var cartoDBSource = new ol.source.CartoDB({
        account: 'samueldeschampsberger',
        config: mapConfig
        });
        
        var mtft_1728Layer = new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'https://api.mapbox.com/v4/samueldb.5ajstwl3/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FtdWVsZGIiLCJhIjoiY2lzc2t4a3RnMDAwYTJ5bnplNjBiYXg4dyJ9.D9yc49jOivEKLDNmFaqIeg'
          }),
          title: "mappe Sarde de 1728"
        })
        var mtft_1888Layer = new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'https://api.mapbox.com/v4/samueldb.5vy14jxi/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FtdWVsZGIiLCJhIjoiY2lzc2t4a3RnMDAwYTJ5bnplNjBiYXg4dyJ9.D9yc49jOivEKLDNmFaqIeg'
          }),
          title: "cadastre de 1888"
        })
        
        var cartoDBLayer = new ol.layer.Tile({
            source: cartoDBSource,
            title: "batiments actuels"
          })
        var map = new ol.Map({
        layers: [
          baseLayers,
          mtft_1728Layer,
          mtft_1888Layer,
          cartoDBLayer,
        ],
        target: 'cartodb-map',
        view: new ol.View({
          center: ol.proj.fromLonLat([6.5688, 45.48978]),
          zoom: 16
        })
        });
        // Add a layer switcher outside the map
        var switcher = new ol.control.LayerSwitcher(
            {	target:$(".layerSwitcher").get(0), 
                show_progress:true,
                extent: true,
                trash: true,
                oninfo: function (l) { alert(l.get("title")); }
            });
        map.addControl(switcher);

        
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