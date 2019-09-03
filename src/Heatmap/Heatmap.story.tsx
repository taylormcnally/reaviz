import React from 'react';
import { storiesOf } from '@storybook/react';
import { Heatmap } from './Heatmap';
import { heatmapSimpleData } from '../../demo';

storiesOf('Charts/Heatmap', module).add('Basic', () => (
  <Heatmap height={250} width={400} data={heatmapSimpleData} />
));
