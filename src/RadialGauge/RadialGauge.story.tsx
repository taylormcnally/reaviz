import React from 'react';
import { storiesOf } from '@storybook/react';
import { RadialGauge } from './RadialGauge';
import { number, object } from '@storybook/addon-knobs';

storiesOf('Charts/Radial Gauge', module)
  .add('Simple', () => {
    const startAngle = number('Start Angle', 0);
    const endAngle = number('End Angle', Math.PI * 2);
    const minValue = number('Min Value', 0);
    const maxValue = number('Max Value', 100);
    const height = number('Height', 300);
    const width = number('Width', 300);
    const data = object('Data', {
      key: 'Austin',
      data: 30
    });

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
