import React from 'react';
import { storiesOf } from '@storybook/react';
import { RadialAreaChart } from './RadialAreaChart';
import { medDateData } from '../common/demo';

storiesOf('Charts/Area/Radial', module)
 .add('Simple', () => (
    <RadialAreaChart
      height={300}
      width={300}
      data={medDateData}
    />
  ));
