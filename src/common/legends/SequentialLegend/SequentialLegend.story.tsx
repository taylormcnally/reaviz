import React from 'react';
import { storiesOf } from '@storybook/react';
import { SequentialLegend } from './SequentialLegend';

storiesOf('Charts/Legend/Sequential', module)
  .add('Vertical', () => <SequentialLegend />)
  .add('Horizontal', () => <SequentialLegend orientation="horizontal" />);
