import React, { Component } from 'react';

export interface RadialAxisTickLineProps {
  size: number;
  stroke: string;
}

export class RadialAxisTickLine extends Component<RadialAxisTickLineProps> {
  static defaultProps: Partial<RadialAxisTickLineProps> = {
    stroke: '#054856',
    size: 10
  };

  render() {
    const { stroke, size } = this.props;
    return <line x2={0} x1={size} stroke={stroke} />;
  }
}
