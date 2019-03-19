import React from 'react';
import { storiesOf } from '@storybook/react';
import { medDateData } from '../common/demo';
import { number, boolean, withKnobs, object, array } from '@storybook/addon-knobs';
import { sequentialScheme } from '../common/utils/color';
import { RadialScatterPlot } from './RadialScatterPlot';

storiesOf('Charts/Scatter Plot/Radial', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const innerRadius = number('Inner Radius', 80);
    const animated = boolean('Animated', true);
    const colorScheme = array('Color Scheme', sequentialScheme);
    const data = object('Data', medDateData);

    return (
      <RadialScatterPlot
        height={300}
        width={300}
        data={data}
        innerRadius={innerRadius}
      />
    );
  }, { options: { showAddonPanel: true } });
