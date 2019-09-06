import React from 'react';
import { storiesOf } from '@storybook/react';
import { Heatmap } from './Heatmap';
import { CalendarHeatmap } from './CalendarHeatmap';
import {
  heatmapSimpleData,
  heatmapCalendarData,
  janHeatMapData,
  febHeatMapData,
  marchHeatMapData
} from '../../demo';

storiesOf('Charts/Heatmap', module)
  .add('Basic', () => (
    <Heatmap height={250} width={400} data={heatmapSimpleData} />
  ))
  .add('Basic + Legend', () => (
    <div style={{ display: 'flex' }}>
      <Heatmap height={250} width={400} data={heatmapSimpleData} />
    </div>
  ))
  .add('Year Calendar', () => (
    <CalendarHeatmap height={115} width={715} data={heatmapCalendarData} />
  ))
  .add('Month Calendar', () => (
    <CalendarHeatmap
      height={115}
      width={100}
      view="month"
      data={janHeatMapData}
    />
  ))
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
