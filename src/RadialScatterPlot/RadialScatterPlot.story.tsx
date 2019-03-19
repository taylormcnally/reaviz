import React from 'react';
import { storiesOf } from '@storybook/react';
import { medDateData, largeSignalChartData } from '../common/demo';
import { number, boolean, withKnobs, object, color } from '@storybook/addon-knobs';
import { RadialScatterPlot } from './RadialScatterPlot';
import { RadialScatterSeries, RadialScatterPoint } from './RadialScatterSeries';

storiesOf('Charts/Scatter Plot/Radial', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const innerRadius = number('Inner Radius', 80);
    const animated = boolean('Animated', true);
    const data = object('Data', medDateData);
    const fill = color('Fill', 'rgba(174, 52, 255, .5)');

    return (
      <RadialScatterPlot
        height={300}
        width={300}
        data={data}
        innerRadius={innerRadius}
        series={
          <RadialScatterSeries
            animated={animated}
            point={
              <RadialScatterPoint
                fill={fill}
              />
            }
          />
        }
      />
    );
  }, { options: { showAddonPanel: true } })
  .add('Bubble', () => {
    const innerRadius = number('Inner Radius', 80);
    const animated = boolean('Animated', true);
    const fill = color('Fill', 'rgba(174, 52, 255, .5)');
    const data = object('Data', largeSignalChartData);

    return (
      <RadialScatterPlot
        height={300}
        width={300}
        data={data}
        innerRadius={innerRadius}
        series={
          <RadialScatterSeries
            animated={animated}
            point={
              <RadialScatterPoint
                fill={fill}
                size={v => v.meta.severity + 5}
              />
            }
          />
        }
      />
    );
  }, { options: { showAddonPanel: true } })
  .add('Resizable', () => (
    <div style={{ width: '50vw', height: '75vh', border: 'solid 1px red' }}>
      <RadialScatterPlot
        data={medDateData}
      />
    </div>
  ));
