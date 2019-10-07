import React from 'react';
import { storiesOf } from '@storybook/react';
import { Heatmap } from './Heatmap';
import { CalendarHeatmap } from './CalendarHeatmap';
import {
  heatmapSimpleData,
  heatmapCalendarData,
  janHeatMapData,
  febHeatMapData,
  marchHeatMapData,
  heatmapCalendarOffsetData
} from '../../demo';
import { SequentialLegend } from '../common/legends/SequentialLegend/SequentialLegend';
import { number, object, select } from '@storybook/addon-knobs';
import { HeatmapSeries } from './HeatmapSeries';
import { schemes } from '../common/color';

storiesOf('Demos|Heatmap', module)
  .add(
    'Basic',
    () => {
      const height = number('Height', 250);
      const width = number('Width', 400);
      const color = select('Color Scheme', schemes, 'OrRd');
      const data = object('Data', heatmapSimpleData);

      return (
        <Heatmap
          height={height}
          width={width}
          data={data}
          series={<HeatmapSeries colorScheme={color} />}
        />
      );
    },
    { options: { showPanel: true } }
  )
  .add('Basic + Legend', () => (
    <div style={{ display: 'flex', height: '250px' }}>
      <Heatmap height={250} width={400} data={heatmapSimpleData} />
      <SequentialLegend
        data={heatmapSimpleData}
        style={{ height: '165px', marginLeft: '10px' }}
      />
    </div>
  ))
  .add(
    'Year Calendar',
    () => {
      const height = number('Height', 115);
      const width = number('Width', 715);
      const data = object('Data', heatmapCalendarData);

      return <CalendarHeatmap height={height} width={width} data={data} />;
    },
    { options: { showPanel: true } }
  )
  .add(
    'Year Calendar w/ March Start',
    () => {
      const height = number('Height', 115);
      const width = number('Width', 715);
      const data = object('Data', heatmapCalendarOffsetData);

      return <CalendarHeatmap height={height} width={width} data={data} />;
    },
    { options: { showPanel: true } }
  )
  .add(
    'Month Calendar',
    () => {
      const height = number('Height', 115);
      const width = number('Width', 100);
      const data = object('Data', janHeatMapData);

      return (
        <CalendarHeatmap
          height={height}
          width={width}
          view="month"
          data={data}
        />
      );
    },
    { options: { showPanel: true } }
  )
  .add('Multi Month Calendar', () => (
    <div style={{ display: 'flex' }}>
      <CalendarHeatmap
        height={115}
        width={100}
        view="month"
        data={janHeatMapData}
      />
      <CalendarHeatmap
        height={115}
        width={100}
        view="month"
        data={febHeatMapData}
      />
      <CalendarHeatmap
        height={115}
        width={100}
        view="month"
        data={marchHeatMapData}
      />
    </div>
  ));
