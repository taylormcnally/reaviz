import React from 'react';
import { storiesOf } from '@storybook/react';
import { RadialAreaChart } from './RadialAreaChart';
import { medDateData } from '../common/demo';
import { RadialAreaSeries } from './RadialAreaSeries';
import { number, boolean, withKnobs, object, array } from '@storybook/addon-knobs';
import { sequentialScheme } from '../common/utils/color';

storiesOf('Charts/Area/Radial', module)
  .addDecorator(withKnobs)
  .add('Simple Area', () => {
    const innerRadius = number('Inner Radius', 80);
    const animated = boolean('Animated', true);
    const colorScheme = array('Color Scheme', sequentialScheme);
    const data = object('Data', medDateData);

    return (
      <RadialAreaChart
        height={300}
        width={300}
        data={data}
        innerRadius={innerRadius}
        series={
          <RadialAreaSeries
            colorScheme={colorScheme}
            animated={animated}
          />
        }
      />
    );
  }, { options: { showAddonPanel: true } })
  .add('Simple Line', () => {
    const innerRadius = number('Inner Radius', 80);
    const animated = boolean('Animated', true);
    const colorScheme = array('Color Scheme', sequentialScheme);
    const data = object('Data', medDateData);

    return (
      <RadialAreaChart
        height={300}
        width={300}
        data={data}
        innerRadius={innerRadius}
        series={
          <RadialAreaSeries
            area={null}
            colorScheme={colorScheme}
            animated={animated}
          />
        }
      />
    );
  }, { options: { showAddonPanel: true } })
  .add('Resizable', () => (
    <div style={{ width: '50vw', height: '75vh', border: 'solid 1px red' }}>
      <RadialAreaChart
        data={medDateData}
      />
    </div>
  ));
