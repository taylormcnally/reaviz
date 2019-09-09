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

storiesOf('Charts/Heatmap', module)
  .add('Basic', () => (
    <Heatmap height={250} width={400} data={heatmapSimpleData} />
  ))
  .add('Basic + Legend', () => (
    <div style={{ display: 'flex', height: '250px' }}>
      <Heatmap height={250} width={400} data={heatmapSimpleData} />
      <SequentialLegend
        data={heatmapSimpleData}
        style={{ height: '165px', marginLeft: '10px' }}
      />
    </div>
  ))
  .add('Year Calendar', () => (
    <CalendarHeatmap height={115} width={715} data={heatmapCalendarData} />
  ))
  .add('Year Calendar w/ March Start', () => (
    <CalendarHeatmap
      height={115}
      width={715}
      data={heatmapCalendarOffsetData}
    />
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
