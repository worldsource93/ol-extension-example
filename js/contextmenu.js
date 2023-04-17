import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer, Group as LayerGroup } from "ol/layer";
import { Attribution, defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions, Draw, Select as OLSelect } from 'ol/interaction';
import { Vector as VectorSource, XYZ, TileWMS, OSM } from 'ol/source'
import * as olProj from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import LayerSwitcher from "ol-layerswitcher";
import ContextMenu from "ol-contextmenu";
const GEOSERVER_URL = 'http://localhost:8080/geoserver/wms';

const baseMaps = [
  new TileLayer({
    title: 'OSM',
    type: 'base',
    source: new OSM()
  }),
  new TileLayer({
    title: 'vworld gray', type: 'base',
    source: new XYZ({
      url: 'https://xdworld.vworld.kr/2d/gray/service/{z}/{x}/{y}.png',
      attributions: '공간정보오픈플랫폼 VWORLD 2019 | 국토교통부',
    }),
  }),
  new TileLayer({
    title: 'vworld base', type: 'base',
    source: new XYZ({
      url: 'https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png',
      attributions: '공간정보오픈플랫폼 VWORLD 2019 | 국토교통부',
    })
  }),
  new TileLayer({
    title: 'vworld satellite', type: 'base',
    source: new XYZ({
      url: 'https://xdworld.vworld.kr/2d/Satellite/service/{z}/{x}/{y}.jpeg',
      attributions: '공간정보오픈플랫폼 VWORLD 2019 | 국토교통부',
    })
  }),
  new TileLayer({
    title: 'vworld midnight', type: 'base',
    source: new XYZ({
      url: 'http://xdworld.vworld.kr:8080/2d/midnight/service/{z}/{x}/{y}.png',
      attributions: '공간정보오픈플랫폼 VWORLD 2019 | 국토교통부',
    })
  }),
];

const layers = [
  new TileLayer({
    title: 'stores',
    source: new TileWMS({
      url: GEOSERVER_URL,
      params: {
        VERSION: '1.3.0', FORMAT: 'image/png', TRANSPARENT: 'true', tiled: 'true',
        LAYERS: 'seoul:stores'
      }
    })
  }),
  new TileLayer({
    title: 'admin_emd',
    source: new TileWMS({
      url: GEOSERVER_URL,
      params: {
        VERSION: '1.3.0', FORMAT: 'image/png', TRANSPARENT: 'true', tiled: 'true',
        LAYERS: 'seoul:admin_emd'
      }
    })
  }),
  new TileLayer({
    title: 'admin_sgg',
    source: new TileWMS({
      url: GEOSERVER_URL,
      params: {
        VERSION: '1.3.0', FORMAT: 'image/png', TRANSPARENT: 'true', tiled: 'true',
        LAYERS: 'seoul:admin_sgg'
      }
    })
  }),
  new TileLayer({
    title: 'admin_sid',
    source: new TileWMS({
      url: GEOSERVER_URL,
      params: {
        VERSION: '1.3.0', FORMAT: 'image/png', TRANSPARENT: 'true', tiled: 'true',
        LAYERS: 'seoul:admin_sid'
      }
    })
  }),
];

const mapView = new View({
  center: olProj.transform([127, 37], 'EPSG:4326', 'EPSG:3857'),
  projection: 'EPSG:3857',
  zoom: 7
});

const map = new Map({
  target: 'map',
  view: mapView,
  layers: [
    new LayerGroup({
      title: 'Base maps',
      layers: baseMaps
    }),
    new LayerGroup({
      title: 'Overlays',
      layers: layers
    }),
  ],
  controls: defaultControls({ attribution: false }).extend([
    new Attribution({ collapsible: false })
  ]),
  interactions: defaultInteractions().extend([])
});

const layerSwitcher = new LayerSwitcher({
  reverse: false,
  groupSelectStyle: 'group'
});

map.addControl(layerSwitcher);

const contextmenu = new ContextMenu({
  width: 170,
    defaultItems: true, // defaultItems are (for now) Zoom In/Zoom Out
    items: [
      {
        text: 'Center map here',
        callback: e => {

        } 
      },
      {
        text: 'Add a Marker',
        callback: e => {


        }
      },
      '-' // this is a separator
    ]
});

map.addControl(contextmenu);