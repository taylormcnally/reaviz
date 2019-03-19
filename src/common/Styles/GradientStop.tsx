import React from 'react';

export interface GradientStopProps {
  offset: number | string;
  stopOpacity: number | string;
  color?: string;
}

export const GradientStop = ({ offset, stopOpacity, color }: GradientStopProps) => (
  <stop
    offset={offset}
    stopOpacity={stopOpacity}
    stopColor={color}
  />
);
