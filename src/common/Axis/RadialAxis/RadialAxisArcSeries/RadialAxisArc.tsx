import React, { Component } from 'react';

export interface RadialAxisArcProps {
  width: number;
  padding: number;
  innerRadius: number;
  count: number;
  index: number;
  stroke: ((index: number) => string) | string;
  strokeDasharray: ((index: number) => string) | string;
}

export class RadialAxisArc extends Component<RadialAxisArcProps> {
  static defaultProps: Partial<RadialAxisArcProps> = {
    stroke: '#054856',
    strokeDasharray: '1,4'
  };

  getOuterRadius(index: number) {
    const { innerRadius, count, padding, width } = this.props;
    const arcInnerRadius = innerRadius + (count - (index + 1)) * (width + padding);
    const arcOuterRadius = arcInnerRadius + width;
    return arcOuterRadius;
  }

  render() {
    const { padding, index, stroke, strokeDasharray } = this.props;
    const r = this.getOuterRadius(index) + padding;
    const strokeColor = typeof stroke === 'string' ? stroke : stroke(index);
    const strokeDash =
      typeof strokeDasharray === 'string'
        ? strokeDasharray
        : strokeDasharray(index);

    return (
      <circle
        fill="none"
        strokeDasharray={strokeDash}
        stroke={strokeColor}
        cx="0"
        cy="0"
        r={r}
      />
    );
  }
}
