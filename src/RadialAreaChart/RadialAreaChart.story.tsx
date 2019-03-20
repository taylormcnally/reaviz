import React from 'react';
import { storiesOf } from '@storybook/react';
import { RadialAreaChart } from './RadialAreaChart';
import { medDateData } from '../common/demo';
import { RadialAreaSeries, RadialArea } from './RadialAreaSeries';
import { number, boolean, withKnobs, object, array, select } from '@storybook/addon-knobs';
import { sequentialScheme } from '../common/utils/color';
import { RadialAxis, RadialAxisTickSeries, RadialAxisTick, RadialAxisTickLabel, RadialAxisArcSeries } from '../common/Axis';

storiesOf('Charts/Area/Radial', module)
  .addDecorator(withKnobs)
  .add('Simple Area', () => {
    const innerRadius = number('Inner Radius', .1);
    const animated = boolean('Animated', true);
    const hasGradient = boolean('Gradient', true);
    const autoRotate = boolean('Auto Rotate Labels', true);
    const colorScheme = array('Color Scheme', sequentialScheme);
    const gradient = hasGradient ? RadialArea.defaultProps.gradient : null;
    const tickCount = number('Axis Tick Count', 5);
    const arcCount = number('Axis Arc Count', 10);
    const interpolation = select('Interpolation', {
      linear: 'linear',
      smooth: 'smooth'
    }, 'smooth');
    const data = object('Data', medDateData);

    return (
      <RadialAreaChart
        height={450}
        width={450}
        data={data}
        innerRadius={innerRadius}
        series={
          <RadialAreaSeries
            colorScheme={colorScheme}
            animated={animated}
            interpolation={interpolation}
            area={
              <RadialArea
                gradient={gradient}
              />
            }
          />
        }
        axis={
          <RadialAxis
            arcs={
              <RadialAxisArcSeries
                count={arcCount}
              />
            }
            ticks={
              <RadialAxisTickSeries
                count={tickCount}
                tick={
                  <RadialAxisTick
                    label={
                      <RadialAxisTickLabel
                        autoRotate={autoRotate}
                      />
                    }
                  />
                }
              />
            }
          />
        }
      />
    );
  }, { options: { showAddonPanel: true } })
  .add('Simple Line', () => {
    const innerRadius = number('Inner Radius', 80);
    const animated = boolean('Animated', true);
    const autoRotate = boolean('Auto Rotate Labels', true);
    const colorScheme = array('Color Scheme', sequentialScheme);
    const tickCount = number('Axis Tick Count', 5);
    const arcCount = number('Axis Arc Count', 10);
    const interpolation = select('Interpolation', {
      linear: 'linear',
      smooth: 'smooth'
    }, 'smooth');
    const data = object('Data', medDateData);

    return (
      <RadialAreaChart
        height={450}
        width={450}
        data={data}
        innerRadius={innerRadius}
        series={
          <RadialAreaSeries
            area={null}
            colorScheme={colorScheme}
            animated={animated}
            interpolation={interpolation}
          />
        }
        axis={
          <RadialAxis
            arcs={
              <RadialAxisArcSeries
                count={arcCount}
              />
            }
            ticks={
              <RadialAxisTickSeries
                count={tickCount}
                tick={
                  <RadialAxisTick
                    label={
                      <RadialAxisTickLabel
                        autoRotate={autoRotate}
                      />
                    }
                  />
                }
              />
            }
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
