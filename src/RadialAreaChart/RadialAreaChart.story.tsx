import React from 'react';
import { storiesOf } from '@storybook/react';
import { RadialAreaChart } from './RadialAreaChart';
import { medDateData } from '../common/demo';
import { RadialAreaSeries, RadialArea } from './RadialAreaSeries';
import { number, boolean, withKnobs, object, array, select } from '@storybook/addon-knobs';
import { sequentialScheme } from '../common/utils/color';
import { RadialAxis, RadialAxisTickSeries, RadialAxisTick, RadialAxisTickLabel, RadialAxisArcSeries, RadialAxisTickLine } from '../common/Axis';

storiesOf('Charts/Area/Radial', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const innerRadius = number('Inner Radius', .1);
    const animated = boolean('Animated', true);
    const hasGradient = boolean('Gradient', true);
    const autoRotate = boolean('Auto Rotate Labels', true);
    const colorScheme = array('Color Scheme', sequentialScheme);
    const gradient = hasGradient ? RadialArea.defaultProps.gradient : null;
    const tickCount = number('Tick Count', 5);
    const arcCount = number('Arc Count', 10);
    const tickPosition = select('Tick Position', {
      inside: 'inside',
      outside: 'outside'
    }, 'inside');
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
                    line={
                      <RadialAxisTickLine
                        position={tickPosition}
                      />
                    }
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


storiesOf('Charts/Line/Radial', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const innerRadius = number('Inner Radius', 80);
    const animated = boolean('Animated', true);
    const colorScheme = array('Color Scheme', sequentialScheme);
    const autoRotate = boolean('Auto Rotate Labels', true);
    const tickCount = number('Tick Count', 5);
    const tickPosition = select('Tick Position', {
      inside: 'inside',
      outside: 'outside'
    }, 'outside');
    const arcCount = number('Arc Count', 10);
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
                    line={
                      <RadialAxisTickLine
                        position={tickPosition}
                      />
                    }
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
