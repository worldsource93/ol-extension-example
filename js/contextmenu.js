import { Feature, Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource, OSM } from 'ol/source'
import * as olProj from 'ol/proj';
import ContextMenu from "ol-contextmenu";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import * as olCoordinate from 'ol/coordinate';
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import { Point } from "ol/geom";

const baseMap =
  new TileLayer({
    source: new OSM()
  });

const vectorLayer = new VectorLayer({
  source: new VectorSource()
});

const mapView = new View({
  center: olProj.transform([0, 0], 'EPSG:4326', 'EPSG:3857'),
  projection: 'EPSG:3857',
  zoom: 3
});

const map = new Map({
  target: 'map',
  view: mapView,
  layers: [baseMap, vectorLayer]
});

const pinIcon = 'https://cdn.jsdelivr.net/gh/jonataswalker/ol-contextmenu@604befc46d737d814505b5d90fc171932f747043/examples/img/pin_drop.png';
const centerIcon = 'https://cdn.jsdelivr.net/gh/jonataswalker/ol-contextmenu@604befc46d737d814505b5d90fc171932f747043/examples/img/center.png';
const listIcon = 'https://cdn.jsdelivr.net/gh/jonataswalker/ol-contextmenu@604befc46d737d814505b5d90fc171932f747043/examples/img/view_list.png';

const contextmenuItems = [
  {
    text: 'Center map here',
    classname: 'bold',
    icon: centerIcon,
    callback: center
  },
  {
    text: 'Some Actions',
    icon: listIcon,
    items: [
      {
        text: 'Center map here',
        icon: centerIcon,
        callback: center
      },
      {
        text: 'Add a Marker',
        icon: pinIcon,
        callback: marker
      }
    ]
  },
  {
    text: 'Add a Marker',
    icon: pinIcon,
    callback: marker
  },
  '-' // this is a separator
];

const contextmenu = new ContextMenu({
  width: 180,
  items: contextmenuItems
});
map.addControl(contextmenu);

const removeMarkerItem = {
  text: 'Remove this Marker',
  classname: 'marker',
  callback: removeMarker
};

contextmenu.on('open', function (evt) {
  const feature =	map.forEachFeatureAtPixel(evt.pixel, ft => ft);
  
  if (feature && feature.get('type') === 'removable') {
    contextmenu.clear();
    removeMarkerItem.data = { marker: feature };
    contextmenu.push(removeMarkerItem);
  } else {
    contextmenu.clear();
    contextmenu.extend(contextmenuItems);
    contextmenu.extend(contextmenu.getDefaultItems());
  }
});

map.on('pointermove', function (e) {
  if (e.dragging) return;

  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);

  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

// from https://github.com/DmitryBaranovskiy/raphael
function elastic(t) {
  return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
}

function center(obj) {
  mapView.animate({
    duration: 700,
    easing: elastic,
    center: obj.coordinate
  });
}

function removeMarker(obj) {
  vectorLayer.getSource().removeFeature(obj.data.marker);
}

function marker(obj) {
  const coord4326 = olProj.transform(obj.coordinate, 'EPSG:3857', 'EPSG:4326');
  const template = 'Coordinate is ({x} | {y})';
  const iconStyle = new Style({
    image: new Icon({ scale: .6, src: pinIcon }),
    text: new Text({
      offsetY: 25,
      text: olCoordinate.format(coord4326, template, 2),
      font: '15px Open Sans,sans-serif',
      fill: new Fill({ color: '#111' }),
      stroke: new Stroke({ color: '#eee', width: 2 })
    })
  });
  const feature = new Feature({
    type: 'removable',
    geometry: new Point(obj.coordinate)
  });

  feature.setStyle(iconStyle);
  vectorLayer.getSource().addFeature(feature);
}
