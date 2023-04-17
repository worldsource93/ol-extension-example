// Layers
var layer = new ol.layer.Tile({
  title:'terrain-background',
  source: new ol.source.Stamen({ layer: 'terrain' })
});

// The map
var map = new ol.Map ({
  target: 'map',
  view: new ol.View({
    zoom: 5,
    center: [166326, 5992663]
  }),
  layers: [layer, new ol.layer.Vector()]
});

// Bounce easing (custom)
var bounce = 5;
var a = (2*bounce+1) * Math.PI/2;
var b = -0.01;
var c = -Math.cos(a) * Math.pow(2, b);
ol.easing.bounce = function(t) {
  t = 1-Math.cos(t*Math.PI/2);
  return (1 + Math.abs( Math.cos(a*t) ) * Math.pow(2, b*t) + c*t)/2;
}

// Preload image (?)
var icon = new ol.style.Icon ({ src:"../data/smile.png" });
icon.load();

// Pulse feature at coord
function pulseFeature(coord){
  var f = new ol.Feature (new ol.geom.Point(coord));
  f.setStyle (new ol.style.Style({
    image: new ol.style[$("#form").val()] ({
      radius: 30, 
      points: 4,
      src: "../data/smile.png",
      stroke: new ol.style.Stroke ({ color: $("#color").val(), width:2 })
    })
  }));
  map.animateFeature (f, new ol.featureAnimation.Zoom({
    fade: ol.easing.easeOut, 
    duration: 3000, 
    easing: ol.easing[$("#easing").val()] 
  }));
}

// Pulse on click 
map.on('singleclick', function(evt) {
  pulseFeature(evt.coordinate);
});

// Pulse at lonlat
function pulse(lonlat) {
  var nb = $('#easing').val()=='bounce' ? 1:3;
  for (var i=0; i<nb; i++) {
    setTimeout (function() {
      pulseFeature (ol.proj.transform(lonlat, 'EPSG:4326', map.getView().getProjection()));
    }, i*500);
  };
}