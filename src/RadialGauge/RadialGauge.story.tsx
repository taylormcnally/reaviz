import React from 'react';
import { storiesOf } from '@storybook/react';
import { RadialGauge } from './RadialGauge';
import { number, object, color, array } from '@storybook/addon-knobs';
import { categoryData } from '../common/demo';
import { RadialGaugeSeries } from './RadialGaugeSeries';

storiesOf('Charts/Radial Gauge', module)
  .add('Single', () => {
    const startAngle = number('Start Angle', 0);
    const endAngle = number('End Angle', Math.PI * 2);
    const minValue = number('Min Value', 0);
    const maxValue = number('Max Value', 100);
    const height = number('Height', 300);
    const width = number('Width', 300);
    const colorScheme = color('Color', '#418AD7');
    const data = object('Data', [{
      key: 'Austin, TX',
      data: 24
    }]);

    return (
      <RadialGauge
        data={data}
        startAngle={startAngle}
        endAngle={endAngle}
        height={height}
        width={width}
        minValue={minValue}
        maxValue={maxValue}
        series={
          <RadialGaugeSeries
            colorScheme={[colorScheme]}
          />
        }
      />
    );
  }, { options: { showAddonPanel: true } })
  .add('Multi', () => {
    const startAngle = number('Start Angle', 0);
    const endAngle = number('End Angle', Math.PI * 2);
    const height = number('Height', 300);
    const width = number('Width', 500);
    const colorScheme = array('Color Scheme', [
      '#CE003E',
      '#DF8D03',
      '#00ECB1',
      '#9FA9B1'
    ]);
    const data = object('Data', categoryData);
    const maxValue = data
      .map(d => d.data)
      .reduce((sum, d) => sum + d, 0);

    return (
      <RadialGauge
        data={data}
        startAngle={startAngle}
        endAngle={endAngle}
        height={height}
        width={width}
        minValue={0}
        maxValue={maxValue}
        series={
          <RadialGaugeSeries
            colorScheme={colorScheme}
          />
        }
      />
    );
  }, { options: { showAddonPanel: true } })
  .add('Autosize', () => (
    <div style={{ width: '50vw', height: '50vh', border: 'solid 1px red' }}>
      <RadialGauge data={categoryData} />
    </div>
  ))
