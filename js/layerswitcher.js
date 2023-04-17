import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer, Group as LayerGroup } from "ol/layer";
import { Attribution, defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions, Draw, Select as OLSelect } from 'ol/interaction';
import { Vector as VectorSource, XYZ, TileWMS } from 'ol/source'
import * as olProj from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import LayerSwitcher from "ol-layerswitcher";
const GEOSERVER_URL = 'http://localhost:8080/geoserver/wms';

const baseMaps = [
  new TileLayer({
    title: 'vworld gray', type: 'base',
    source: new XYZ({
      url: 'https://xdworld.vworld.kr/2d/gray/service/{z}/{x}/{y}.png',
      attributions: '공간정보오픈플랫폼 VWORLD 2019 | 국토교통부',
    }),
  }),
  new TileLayer({
    title: 'vworld base', type: 'base',
    visible: false,
    source: new XYZ({
      url: 'https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png',
      attributions: '공간정보오픈플랫폼 VWORLD 2019 | 국토교통부',
    })
  }),
  new TileLayer({
    title: 'vworld satellite', type: 'base',
    visible: false,
    source: new XYZ({
      url: 'https://xdworld.vworld.kr/2d/Satellite/service/{z}/{x}/{y}.jpeg',
      attributions: '공간정보오픈플랫폼 VWORLD 2019 | 국토교통부',
    })
  }),
  new TileLayer({
    title: 'vworld midnight', type: 'base',
    visible: false,
    source: new XYZ({
      url: 'http://xdworld.vworld.kr:8080/2d/midnight/service/{z}/{x}/{y}.png',
      attributions: '공간정보오픈플랫폼 VWORLD 2019 | 국토교통부',
    })
  })
];

const layers = [
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
    title: 'stores',
    source: new TileWMS({
      url: GEOSERVER_URL,
      params: {
        VERSION: '1.3.0', FORMAT: 'image/png', TRANSPARENT: 'true', tiled: 'true',
        LAYERS: 'seoul:stores'
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
  reverse: true,
  groupSelectStyle: 'group'
});

map.addControl(layerSwitcher);