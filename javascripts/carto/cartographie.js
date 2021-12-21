var map;
var apikey = "261bbc94c8266573016ba9454127b905b931b0a6";
var user = 'samuel';
var sublayers = [];

function init() {
    var testMap;
    var editor;
    var mbUrl = "https://dnv9my2eseobd.cloudfront.net/v3/cartodb.map-4xtxp73f/{x}/{y}/{z}.png";
    var mbAttr = "attribution: 'Mapbox <a href=\"https://mapbox.com/about/maps\" target=\"_light\">Terms &amp; Feedback</a>'";
    var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr});
    
    var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abcd',
            minZoom: 1,
            maxZoom: 16,
            ext: 'png'
        });
        var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        });
        var Stamen_TonerLines = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}.{ext}', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        });
        // pas terrible en haute r�solution
        var Esri_WorldPhysical = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
            maxZoom: 8
        });
        var Esri_NatGeoWorldMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
            maxZoom: 16
        });
        map = new L.Map('cartodb-map', {
            center: [45,4],
            zoom: 5,
            attributionControl: false,
            layers: [Esri_NatGeoWorldMap,Stamen_TonerLines]
          });
        //L.control.layers([Esri_WorldPhysical]).addTo(map);
       cartodb.createLayer(map, 'https://samueldeschampsberger.cartodb.com/api/v2/viz/55491dc2-3d03-11e5-a85a-0e4fddd5de28/viz.json')
        .addTo(map)
        .done(function(layer) {
            layer.setZIndex(1);
            var sublayer = layer.getSubLayer(0);
            sublayers.push(sublayer);
          
        }	);
        map.options.minZoom = 2;
}