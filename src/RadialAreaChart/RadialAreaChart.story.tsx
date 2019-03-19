import React from 'react';
import { storiesOf } from '@storybook/react';
import { RadialAreaChart } from './RadialAreaChart';
import { medDateData } from '../common/demo';
import { RadialAreaSeries } from './RadialAreaSeries';

storiesOf('Charts/Area/Radial', module)
 .add('Simple Area', () => (
    <RadialAreaChart
      height={300}
      width={300}
      data={medDateData}
    />
  ))
  .add('Simple Line', () => (
    <RadialAreaChart
      height={300}
      width={300}
      data={medDateData}
      series={
        <RadialAreaSeries
          area={null}
        />
      }
    />
  ));
