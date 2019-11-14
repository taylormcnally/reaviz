import React, { FC } from 'react';
import { Bar, BarProps } from '../BarChart';

export type LinearGaugeBarProps = BarProps;

export const LinearGaugeBar: FC<Partial<LinearGaugeBarProps>> = props => (
  <Bar
    {...props}
    rounded={false}
  />
);
