'use strict';

const gjson = require('../b-cycle-stations.geojson.json');

let id = 1;

function toDoc(feature) {
  return {
    category: 'b-cycle',
    name: feature.properties.STATION,
    address: {
      city: feature.properties.CITY_LOC
    },
    lng: feature.properties.LONG,
    lat: feature.properties.LAT,
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
