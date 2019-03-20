import React from 'react';
import { storiesOf } from '@storybook/react';
import { RadialBarChart } from './RadialBarChart';
import { largeCategoryData } from '../common/demo';
import { number, boolean, withKnobs, object, array } from '@storybook/addon-knobs';
import { sequentialScheme } from '../common/utils/color';
import { RadialBarSeries, RadialBar } from './RadialBarSeries';

storiesOf('Charts/Bar/Radial', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const innerRadius = number('Inner Radius', 50);
    const curved = boolean('Curved', false);
    const hasGradient = boolean('Gradient', true);
    const animated = boolean('Animated', true);
    const colorScheme = array('Color Scheme', sequentialScheme);
    const data = object('Data', largeCategoryData);
    const gradient = hasGradient ? RadialBar.defaultProps.gradient : null;

    return (
      <RadialBarChart
        height={450}
        width={450}
        innerRadius={innerRadius}
        data={data}
        series={
          <RadialBarSeries
            animated={animated}
            colorScheme={colorScheme}
            bar={
              <RadialBar
                curved={curved}
                gradient={gradient}
              />
            }
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
