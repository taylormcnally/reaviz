import React from 'react';
import { Map } from 'reaviz';
import { feature } from 'topojson-client';
import geojson from 'world-atlas/countries-110m.json';

const worldData = feature(geojson, geojson.objects.countries);

export default () => (
  <div style={{ margin: '55px', textAlign: 'center' }}>
    <Map
      data={worldData}
      height={350}
      width={500}
      markers={[
        <MapMarker coordinates={[-122.490402, 37.786453]} />,
        <MapMarker coordinates={[-58.3816, -34.6037]} />,
        <MapMarker coordinates={[-97.7437, 30.2711]} tooltip="Austin, TX" />
      ]}
    />
  </div>
);
