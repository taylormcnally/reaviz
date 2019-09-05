import React from 'react';
import { storiesOf } from '@storybook/react';
import { Heatmap } from './Heatmap';
import { CalendarHeatmap } from './CalendarHeatmap';
import { heatmapSimpleData, heatmapCalendarData } from '../../demo';

storiesOf('Charts/Heatmap', module)
  .add('Basic', () => (
    <Heatmap height={250} width={400} data={heatmapSimpleData} />
  ))
  .add('Calendar', () => <CalendarHeatmap data={heatmapCalendarData} />);
