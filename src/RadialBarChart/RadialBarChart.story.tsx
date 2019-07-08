import React from 'react';
import { storiesOf } from '@storybook/react';
import { RadialBarChart } from './RadialBarChart';
import { largeCategoryData } from '../common/demo';
import { number, boolean, object, array, select } from '@storybook/addon-knobs';
import { sequentialScheme } from '../common/utils/color';
import { RadialBarSeries, RadialBar } from './RadialBarSeries';
import {
  RadialAxis,
  RadialAxisArcSeries,
  RadialAxisTickSeries,
  RadialAxisTick,
  RadialAxisTickLine
} from '../common/Axis/RadialAxis';

storiesOf('Charts/Bar/Radial', module)
  .add(
    'Simple',
    () => {
      const innerRadius = number('Inner Radius', 50);
      const curved = boolean('Curved', false);
      const hasGradient = boolean('Gradient', true);
      const animated = boolean('Animated', true);
      const colorScheme = array('Color Scheme', sequentialScheme);
      const arcCount = number('Arc Count', 10);
      const tickPosition = select(
        'Tick Position',
        {
          inside: 'inside',
          outside: 'outside'
        },
        'inside'
      );
      const data = object('Data', largeCategoryData);
      const gradient = hasGradient ? RadialBar.defaultProps.gradient : false;

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
              bar={<RadialBar curved={curved} gradient={gradient} />}
            />
          }
          axis={
            <RadialAxis
              ticks={
                <RadialAxisTickSeries
                  tick={
                    <RadialAxisTick
                      line={<RadialAxisTickLine position={tickPosition} />}
                    />
                  }
                />
              }
              arcs={<RadialAxisArcSeries count={arcCount} />}
            />
          }
        />
      );
    },
    { options: { showAddonPanel: true } }
  )
  .add('Resizable', () => (
    <div style={{ width: '50vw', height: '75vh', border: 'solid 1px red' }}>
      <RadialBarChart data={largeCategoryData} innerRadius={10} />
    </div>
  ));
