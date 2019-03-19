import React from 'react';
import { storiesOf } from '@storybook/react';
import { RadialBarChart } from './RadialBarChart';
import { largeCategoryData } from '../common/demo';
import { number, boolean, withKnobs, object, array } from '@storybook/addon-knobs';
import { sequentialScheme } from '../common/utils/color';
import { RadialBarSeries } from './RadialBarSeries';

storiesOf('Charts/Bar/Radial', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const innerRadius = number('Inner Radius', 80);
    const animated = boolean('Animated', true);
    const colorScheme = array('Color Scheme', sequentialScheme);
    const data = object('Data', largeCategoryData);

    return (
      <RadialBarChart
        height={300}
        width={300}
        innerRadius={innerRadius}
        data={data}
        series={
          <RadialBarSeries
            animated={animated}
            colorScheme={colorScheme}
          />
        }
      />
    );
  }, { options: { showAddonPanel: true } })
  .add('Resizable', () => (
    <div style={{ width: '50vw', height: '75vh', border: 'solid 1px red' }}>
      <RadialBarChart
        data={largeCategoryData}
      />
    </div>
  ));
