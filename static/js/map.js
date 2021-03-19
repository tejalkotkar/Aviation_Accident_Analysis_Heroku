// Set up initial map center and zoom level
var map = L.map('mapId', {
  center: [37.0902, -95.7129], // EDIT latitude, longitude to re-center map
  zoom: 6,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
  scrollWheelZoom: false,
  tap: false
});

/* Control panel to display map layers */
var controlLayers = L.control.layers( null, null, {
  position: "topright",
  collapsed: false
}).addTo(map);

// display Carto basemap tiles with light features and labels
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(map);
 // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default
controlLayers.addBaseLayer(streetmap, 'Street View ');

/* Stamen colored terrain basemap tiles with labels */
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
})
// EDIT - insert or remove ".addTo(map)" before last semicolon to display by default
controlLayers.addBaseLayer(darkmap, 'Dark Mode');


// see more basemap options at https://leaflet-extras.github.io/leaflet-providers/preview/

// Read markers data from data.csv
$.get('../static/Data/2019-2020_AviationData.csv', function(csvString) { 

// console.log(csvString)
// console.log('check')
  var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;
// console.log(data);


  // For each row in data, create a marker and add it to the map
  // For each row, columns `Latitude`, `Longitude`, and `Title` are required
  for (var i in data) {
    var row = data[i];

var planeIcon = L.icon({
  iconUrl: '../static/Bkg_images/airplane-icon.png',


  iconSize:     [15, 10], // size of the icon
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor:  [-3, -76]
})

// console.log('check 2')
    var marker = L.marker([row.Latitude, row.Longitude], {
      opacity: 1,
      icon:planeIcon
    }).bindPopup(row.Location);
    
    marker.addTo(map);
  }
});

map.attributionControl.setPrefix(
  'View <a href="https://github.com/tejalkotkar/Aviation_Accident_Analysis.git" target="_blank">code on GitHub</a>'
);