'use strict';

const slug = require('slug');
const gjson = require('../b-cycle-stations.geojson.json');

let id = 1;

function createSlug(name) {
  return slug(`b-cycle-${name}`, { lower: true });
}

function toDoc(feature) {
  return {
    slug: createSlug(feature.properties.STATION),
    category: 'b-cycle',
    name: feature.properties.STATION,
    address: {
      city: feature.properties.CITY_LOC
    },
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
      _type: 'b-cycle',
      _id: id++
    }
  };

  return [...actions, JSON.stringify(action), JSON.stringify(doc)];
}

function main() {
  const features = gjson.features;

  const bulk = features
    .filter(feature => feature.properties.CITY_LOC === 'Denver')
    .map(toDoc)
    .reduce(toBulkAction, [])
    .join('\n');

  console.log(bulk);
}

main();
