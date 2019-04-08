import React, { Component } from 'react';
import { GradientStop, GradientStopProps } from './GradientStop';
import { CloneElement } from '../utils';

export interface GradientProps {
  id: string;
  stops: JSX.Element[];
  color?: string;
}

export class Gradient extends Component<GradientProps> {
  static defaultProps: Partial<GradientProps> = {
    stops: [
      <GradientStop offset="0%" stopOpacity={0.3} />,
      <GradientStop offset="80%" stopOpacity={1} />
    ]
  };

  render() {
    const { id, stops, color } = this.props;

    return (
      <linearGradient
        spreadMethod="pad"
        id={id}
        x1="10%"
        x2="10%"
        y1="100%"
        y2="0%"
      >
        {stops.map((stop, index) => (
          <CloneElement<GradientStopProps>
            element={stop}
            key={`gradient-${index}`}
            color={stop.props.color || color}
          />
        ))}
      </linearGradient>
    );
  }
}

