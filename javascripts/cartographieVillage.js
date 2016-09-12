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
        
        var mapConfig_actuel = {
        'layers': [{
          'type': 'cartodb',
          'options': {
            'cartocss_version': '2.1.1',
            'cartocss': '#layer { polygon-fill: #F00; }',
            'sql': 'SELECT * FROM maisons'
          }
        }]
        };
        var mapConfig1728 = {
        'layers': [{
          'type': 'cartodb',
          'options': {
            'cartocss_version': '2.1.1',
            'cartocss': '#layer { polygon-fill: #F00; } '+
                        '#layer[utilisation="Four"] {polygon-fill: #FF6600;}'+
                        '#layer[utilisation="grange"] {polygon-fill: #1F78B4;}'+
                        '#layer[utilisation="habitation"] {polygon-fill: #B2DF8A;}'+
                        '#layer[utilisation="masure"] {polygon-fill: #33A02C;}'+
                        '#layer[utilisation="religieux"] {polygon-fill: #E31A1C;}'
                        ,
            'sql': 'SELECT * FROM parcelles_1728'
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

        // var cartoDBSourceActuel = new ol.source.CartoDB({
        // account: 'samueldeschampsberger',
        // config: mapConfig_actuel
        // });
        // var cartoDBSource1728 = new ol.source.CartoDB({
        // account: 'samueldeschampsberger',
        // config: mapConfig1728
        // });
        
        // Couches Raster : 
        var mtft_1728Layer = new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'https://api.mapbox.com/v4/samueldb.5agbtq27/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FtdWVsZGIiLCJhIjoiY2lzc2t4a3RnMDAwYTJ5bnplNjBiYXg4dyJ9.D9yc49jOivEKLDNmFaqIeg'
          }),
          title: "mappe Sarde de 1728"
        })
        var mtft_1888Layer = new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'https://api.mapbox.com/v4/samueldb.5vy14jxi/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FtdWVsZGIiLCJhIjoiY2lzc2t4a3RnMDAwYTJ5bnplNjBiYXg4dyJ9.D9yc49jOivEKLDNmFaqIeg'
          }),
          title: "cadastre de 1888"
        })
        
        // var cartoDBLayerActuel = new ol.layer.Tile({
            // source: cartoDBSourceActuel,
            // title: "batiments actuels"
          // })
        // var cartoDBLayer1728 = new ol.layer.Tile({
            // source: cartoDBSource1728,
            // title: "batiments 1728",
            // crossOrigin: 'anonymous'
          // })
          
          var view = new ol.View({
          center: ol.proj.fromLonLat([6.5688, 45.48978]),
          zoom: 16
        })
        
        // Batiments 1728
        var batiments1728 = new ol.layer.Vector({
            source: new ol.source.Vector({
              url: 'https://samueldeschampsberger.cartodb.com/api/v2/sql/?format=GeoJSON&q=SELECT%20*%20FROM%20parcelles_1728&format_output=json',
              format: new ol.format.GeoJSON(),
              // type:"FeatureCollection",
            }),
            title: 'batiments 1728',
            style: function(feature, resolution) {
                var strokecolor = 'red';
                if(feature.get('utilisation') == 'grange') {
                    strokecolor = '#1F78B4';
                  } else if(feature.get('utilisation') == 'habitation') {
                    strokecolor = '#B2DF8A';
                  } else if(feature.get('utilisation') == 'masure') {
                    strokecolor = '#33A02C';
                  } else {
                    strokecolor = 'orange';
                  }
                  return new ol.style.Style({
                    fill: new ol.style.Fill({
                      color: strokecolor
                    }),
                    stroke: new ol.style.Stroke({
                      color: [220,220,220,1],
                      width: 1
                    })})
            }
        });
        // Batiments 1888
        var batimentsActuels = new ol.layer.Vector({
            source: new ol.source.Vector({
              url: 'https://samueldeschampsberger.cartodb.com/api/v2/sql/?format=GeoJSON&q=SELECT%20*%20FROM%20maisons&format_output=json',
              format: new ol.format.GeoJSON(),
              // type:"FeatureCollection",
            }),
            title: 'batiments actuels',
            style: function(feature, resolution) {
                var strokecolor = 'red';
                if(feature.get('utilisation') == 'grange') {
                    strokecolor = '#1F78B4';
                  } else if(feature.get('utilisation') == 'habitation') {
                    strokecolor = '#B2DF8A';
                  } else if(feature.get('utilisation') == 'masure') {
                    strokecolor = '#33A02C';
                  } else {
                    strokecolor = 'orange';
                  }
                  return new ol.style.Style({
                    fill: new ol.style.Fill({
                      color: strokecolor
                    }),
                    stroke: new ol.style.Stroke({
                      color: [220,220,220,1],
                      width: 1
                    })})
            }
        });
        
        var map = new ol.Map({
        layers: [
          baseLayers,
          mtft_1728Layer,
          mtft_1888Layer,
          batimentsActuels,
          batiments1728
        ],
        target: 'cartodb-map',
        view: view
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

        map.on('singleclick', function(evt) {
            var coordinate = evt.coordinate;
            
            var featureSelected1728 = batiments1728.getSource().getFeaturesAtCoordinate(coordinate)[0];  // On ne récupère qu'une seule feature
            var featureSelected1888 = batimentsActuels.getSource().getFeaturesAtCoordinate(coordinate)[0];  // On ne récupère qu'une seule feature
            if (featureSelected1728 && batiments1728.getProperties().opacity != 0 && batiments1728.getProperties().visible) {
                document.getElementById('info').innerHTML = '<h5 style:"font-size: 15px;">En 1728 : </h5>'+
                                                            '<p>' + featureSelected1728.get("proprietaire") + ' - ' + featureSelected1728.get("utilisation") + '</p>'+
                                                            '<h5 style:"font-size: 15px;>Actuellement : </h5>'+
                                                            '<p>' + featureSelected1728.get("proprietaire") + ' - ' + featureSelected1728.get("utilisation") + '</p>'
                                                            ;
            }
          });
        
}

function getJSON(req){
    $.ajaxSetup( { "async": false } );
    return $.getJSON(req);
}