'use strict';

const slug = require('slug');
const gjson = require('../light-rail-stations.geojson.json');

let id = 1;

function createSlug(name) {
  return slug(`light-rail-${name}`, { lower: true });
}

function toDoc(feature) {
  return {
    slug: createSlug(feature.properties.NAME),
    category: 'light-rail',
    icon: 'train',
    name: feature.properties.NAME,
    address: {
      street: feature.properties.ADDRESS
    },
    'light_rail_pid': feature.properties.PID,
    'light_rail_autos': feature.properties.AUTOS,
    'light_rail_racks': feature.properties.RACKS,
    'light_rail_lockers': feature.properties.LOCKERS,
    'light_rail_district': feature.properties.DISTRICT,
    'light_rail_shelters': feature.properties.SHELTERS,
    point: {
      lon: feature.geometry.coordinates[0],
      lat: feature.geometry.coordinates[1]
    },
    geometry: feature.geometry
  };
}

function toBulkAction(actions, doc) {
  const action = {
    index: {
      _index: 'pois',
      _type: 'light-rail',
      _id: id++
    }
  };

  return [...actions, JSON.stringify(action), JSON.stringify(doc)];
}

function main() {
  const features = gjson.features;

  const bulk = features
    .map(toDoc)
    .reduce(toBulkAction, [])
    .join('\n');

  console.log(bulk);
}

main();
