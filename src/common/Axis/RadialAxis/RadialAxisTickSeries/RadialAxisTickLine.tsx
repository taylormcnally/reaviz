import React, { Component } from 'react';

export interface RadialAxisTickLineProps {
  size: number;
  stroke: string;
  innerRadius: number;
  outerRadius: number;
  position: 'inside' | 'outside';
}

export class RadialAxisTickLine extends Component<RadialAxisTickLineProps> {
  static defaultProps: Partial<RadialAxisTickLineProps> = {
    stroke: 'rgba(113, 128, 141, .5)',
    size: 10,
    position: 'inside'
  };

  render() {
    const { stroke, size, position, innerRadius, outerRadius } = this.props;
    const x1 = position === 'outside' ? size : -(outerRadius - innerRadius);

    console.log('x1', x1, 'position', position, 'inner', innerRadius, 'size', size, 'outer', outerRadius)

    return <line x1={x1} x2={0} stroke={stroke} />;
  }
}
