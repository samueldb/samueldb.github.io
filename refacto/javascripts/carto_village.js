// import {Group as ol.layer.Group, Tile as ol.layer.Tile} from 'ol/layer';
var map;
var apikey = "261bbc94c8266573016ba9454127b905b931b0a6";
var user = 'samuel';
var sublayers = [];


function init() {
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
        'cartocss': '#layer { polygon-fill: #F00; } ' +
          '#layer[utilisation="Four"] {polygon-fill: #FF6600;}' +
          '#layer[utilisation="grange"] {polygon-fill: #1F78B4;}' +
          '#layer[utilisation="habitation"] {polygon-fill: #B2DF8A;}' +
          '#layer[utilisation="masure"] {polygon-fill: #33A02C;}' +
          '#layer[utilisation="religieux"] {polygon-fill: #E31A1C;}'
        ,
        'sql': 'SELECT * FROM parcelles_1728'
      }
    }]
  };

  // Base Layers : 
  var baseLayers = new ol.layer.Group(
    {
      title: 'fond de plan',
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
            {
              title: "OSM",
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
      // url: 'https://api.mapbox.com/v4/samueldb.5vy14jxi/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FtdWVsZGIiLCJhIjoiY2lzc2t4a3RnMDAwYTJ5bnplNjBiYXg4dyJ9.D9yc49jOivEKLDNmFaqIeg'
      url: 'https://api.mapbox.com/v4/samueldb.2w36gjhb/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FtdWVsZGIiLCJhIjoiY2lzc2t4a3RnMDAwYTJ5bnplNjBiYXg4dyJ9.D9yc49jOivEKLDNmFaqIeg'
    }),
    title: "cadastre de 1888"
  })
  var mtft_ActuLayer = new ol.layer.Tile({
    // extent: [-13884991, 2870341, -7455066, 6338219],
    source: new ol.source.TileWMS({
      url: 'http://inspire.cadastre.gouv.fr/scpc/73253.wms?service=WMS&request=GetMap',
      params: {
        'LAYERS': 'LIEUDIT,CP.CadastralParcel,CLOTURE,DETAIL_TOPO,HYDRO,VOIE_COMMUNICATION,BU.Building,BORNE_REPERE',
        'VERSION': '1.3',
        'FORMAT': 'image/png',
        'WIDTH': '256',
        'HEIGHT': '256',
        'CRS': 'EPSG:3857',
        // 'BBOX':'-13884991, 2870341, -7455066, 6338219'
      },
    }),
    title: 'cadastre actuel'
  })

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
    style: function (feature, resolution) {
      var strokecolor = 'red';
      if (feature.get('utilisation') == 'grange') {
        strokecolor = '#1F78B4';
      } else if (feature.get('utilisation') == 'habitation') {
        strokecolor = '#B2DF8A';
      } else if (feature.get('utilisation') == 'masure') {
        strokecolor = '#33A02C';
      } else {
        strokecolor = 'orange';
      }
      return new ol.style.Style({
        fill: new ol.style.Fill({
          color: strokecolor
        }),
        stroke: new ol.style.Stroke({
          color: [220, 220, 220, 1],
          width: 1
        })
      })
    }
  });
  // Batiments 1888
  var batiments1888 = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'https://samueldeschampsberger.cartodb.com/api/v2/sql/?format=GeoJSON&q=SELECT%20*%20FROM%20maisons_1888&format_output=json',
      format: new ol.format.GeoJSON(),
      // type:"FeatureCollection",
    }),
    title: 'batiments 1888',
    style: function (feature, resolution) {
      var strokecolor = 'red';
      if (feature.get('utilisation') == 'grange') {
        strokecolor = '#1F78B4';
      } else if (feature.get('utilisation') == 'habitation') {
        strokecolor = '#B2DF8A';
      } else if (feature.get('utilisation') == 'masure') {
        strokecolor = '#33A02C';
      } else {
        strokecolor = 'orange';
      }
      return new ol.style.Style({
        fill: new ol.style.Fill({
          color: strokecolor
        }),
        stroke: new ol.style.Stroke({
          color: [220, 220, 220, 1],
          width: 1
        })
      })
    }
  });
  // Batiments Actuels
  var batimentsActuels = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'https://samueldeschampsberger.cartodb.com/api/v2/sql/?format=GeoJSON&q=SELECT%20*%20FROM%20maisons&format_output=json',
      format: new ol.format.GeoJSON(),
      // type:"FeatureCollection",
    }),
    title: 'batiments actuels',
    style: function (feature, resolution) {
      var strokecolor = 'red';
      if (feature.get('utilisation') == 'grange') {
        strokecolor = '#1F78B4';
      } else if (feature.get('utilisation') == 'habitation') {
        strokecolor = '#B2DF8A';
      } else if (feature.get('utilisation') == 'masure') {
        strokecolor = '#33A02C';
      } else {
        strokecolor = 'orange';
      }
      return new ol.style.Style({
        fill: new ol.style.Fill({
          color: strokecolor
        }),
        stroke: new ol.style.Stroke({
          color: [220, 220, 220, 1],
          width: 1
        })
      })
    }
  });

  // Layers 1728 : 
  var layers1728 = new ol.layer.Group(
    {
      title: '1728',
      openInLayerSwitcher: true,
      layers:
        [mtft_1728Layer,
          batiments1728
        ]
    });
  // Layers 1888 : 
  var layers1888 = new ol.layer.Group(
    {
      title: '1888',
      openInLayerSwitcher: true,
      layers:
        [mtft_1888Layer,
          batiments1888
        ]
    });
  // Layers Actuels : 
  var layersActu = new ol.layer.Group(
    {
      title: 'Actuels',
      openInLayerSwitcher: true,
      layers:
        [mtft_ActuLayer,
          batimentsActuels
        ]
    });

  var map = new ol.Map({
    layers: [
      baseLayers,
      layers1728,
      layers1888,
      layersActu
    ],
    target: 'map',
    view: view
  });
  // // Add a layer switcher outside the map

  function bindInputs(layerid, layer) {
    layeridhtml = '';
    title = layer.getProperties().title;
    switch(title){
      case "OSM":
        layeridhtml='#layer10';
        break;
      case "mappe Sarde de 1728":
        layeridhtml='#layer0';
        break;
      case "batiments 1728":
        layeridhtml='#layer1';
        break;
      case "cadastre de 1888":layeridhtml='#layer2';break;
      case "batiments 1888":layeridhtml='#layer3';break;
      case "cadastre actuel":layeridhtml='#layer4';break;
      case "batiments actuels":layeridhtml='#layer5';break;
    }
    var visibilityInput = $(layeridhtml + ' input.visible');
    visibilityInput.on('change', function() {
      layer.setVisible(this.checked);
    });
    visibilityInput.prop('checked', layer.getVisible());

    var opacityInput = $(layeridhtml + ' input.opacity');
    opacityInput.on('input change', function() {
      layer.setOpacity(parseFloat(this.value));
    });
    opacityInput.val(String(layer.getOpacity()));
  }
  
  map.getLayers().forEach(function(layer, i) {
    if (layer instanceof ol.layer.Group) {
      layer.getLayers().forEach(function(sublayer, j) {
        bindInputs('#layer' + i + j, sublayer);
      });
    }
    else {
      bindInputs('#layer' + i, layer);
    }
  });


  // Gestion de la recherche d'information : 
  map.on('singleclick', function (evt) {
    var coordinate = evt.coordinate;
    var featureSelected1728 = batiments1728.getSource().getFeaturesAtCoordinate(coordinate)[0];  // On ne récupère qu'une seule feature
    var featureSelected1888 = batiments1888.getSource().getFeaturesAtCoordinate(coordinate)[0];  // On ne récupère qu'une seule feature
    var featureSelectedActuels = batimentsActuels.getSource().getFeaturesAtCoordinate(coordinate)[0];  // On ne récupère qu'une seule feature
    var proprio1728, usage1728, proprio1888, usage1888, proprioActuel, usageActuel;
    if (featureSelected1728 && batiments1728.getProperties().opacity != 0 && batiments1728.getProperties().visible) {
      proprio1728 = featureSelected1728.get("proprietaire");
      usage1728 = featureSelected1728.get("utilisation");
    }
    else if (!batiments1728.getProperties().visible) {
      proprio1728 = "la couche n'est pas visible sur la carte";
      usage1728 = "";
    }
    else {
      proprio1728 = "pas d'élément pour cette date";
      usage1728 = "";
    }
    if (featureSelected1888 && batiments1888.getProperties().opacity != 0 && batiments1888.getProperties().visible) {
      proprio1888 = featureSelected1888.get("proprietaire");
      usage1888 = featureSelected1888.get("utilisation");
    }
    else if (!batiments1888.getProperties().visible) {
      proprio1888 = "la couche n'est pas visible sur la carte";
      usage1888 = "";
    }
    else {
      proprio1888 = "pas d'élément pour cette date";
      usage1888 = "";
    }
    if (featureSelectedActuels && batimentsActuels.getProperties().opacity != 0 && batimentsActuels.getProperties().visible) {
      proprioActuel = featureSelectedActuels.get("proprietaire");
      usageActuel = featureSelectedActuels.get("utilisation");
    }
    else if (!batimentsActuels.getProperties().visible) {
      proprioActuel = "la couche n'est pas visible sur la carte";
      usageActuel = "";
    }
    else {
      proprioActuel = "pas d'élément pour cette date";
      usageActuel = "";
    }
    document.getElementById('info').innerHTML = '<h5 style:"font-size: 15px;">En 1728 : </h5>' +
      '<p>' + proprio1728 + ' - ' + usage1728 + '</p>' +
      '<h5 style:"font-size: 15px;">En 1888 : </h5>' +
      '<p>' + proprio1888 + ' - ' + usage1888 + '</p>' +
      '<h5 style:"font-size: 15px;>Actuellement : </h5>' +
      '<p>' + proprioActuel + ' - ' + usageActuel + '</p>'
      ;

  });

}

function getJSON(req) {
  $.ajaxSetup({ "async": false });
  return $.getJSON(req);
}