import React from 'react';
import { storiesOf } from '@storybook/react';
import { RadialBarChart } from './RadialBarChart';
import { largeCategoryData } from '../common/demo';

storiesOf('Charts/Bar/Radial', module)
 .add('Simple', () => (
    <RadialBarChart
      height={300}
      width={300}
      data={largeCategoryData}
    />
  ));
