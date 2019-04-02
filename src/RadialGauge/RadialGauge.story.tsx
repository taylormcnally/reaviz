import React from 'react';
import { storiesOf } from '@storybook/react';
import { RadialGauge } from './RadialGauge';
import { number, object } from '@storybook/addon-knobs';
import { categoryData } from '../common/demo';

storiesOf('Charts/Radial Gauge', module)
  .add('Simple', () => {
    const startAngle = number('Start Angle', 0);
    const endAngle = number('End Angle', Math.PI * 2);
    const minValue = number('Min Value', 0);
    const maxValue = number('Max Value', 100);
    const height = number('Height', 300);
    const width = number('Width', 300);
    const data = object('Data', [categoryData[0]]);

    return (
      <RadialGauge
        data={data}
        startAngle={startAngle}
        endAngle={endAngle}
        height={height}
        width={width}
        minValue={minValue}
        maxValue={maxValue}
      />
    );
  }, { options: { showAddonPanel: true } })
  .add('Group', () => {
    const startAngle = number('Start Angle', 0);
    const endAngle = number('End Angle', Math.PI * 2);
    const minValue = number('Min Value', 0);
    const maxValue = number('Max Value', 100);
    const height = number('Height', 300);
    const width = number('Width', 500);
    const data = object('Data', categoryData);

    return (
      <RadialGauge
        data={data}
        startAngle={startAngle}
        endAngle={endAngle}
        height={height}
        width={width}
        minValue={minValue}
        maxValue={maxValue}
      />
    );
  }, { options: { showAddonPanel: true } });
