import React, { Component } from 'react';
import { arc } from 'd3-shape';
import { PosedArc } from '../PieChart';

export interface RadialGaugeArcProps {
  startAngle: number;
  endAngle: number;
  outerRadius: number;
  fill: string;
  width: number;
  animated: boolean;
}

export class RadialGaugeArc extends Component<RadialGaugeArcProps> {
  static defaultProps: Partial<RadialGaugeArcProps> = {
    width: 10,
    fill: '#353d44',
    animated: false
  };

  getPaths() {
    const { outerRadius, startAngle, endAngle, width, animated } = this.props;

    // Calculate the inner rad based on the width
    // and the outer rad which is height/width / 2
    const innerRadius = outerRadius - width;

    // Center arcs so inner/outer align nicely
    const delta = (outerRadius - innerRadius) / 2;
    const newInnerRad = innerRadius + delta;
    const newOuterRad = outerRadius + delta;

    const arcFn = arc()
      .innerRadius(newInnerRad)
      .outerRadius(newOuterRad);

    return {
      enterProps: {
        startAngle,
        endAngle
      },
      exitProps: {
        startAngle,
        endAngle: animated ? 0 : endAngle
      },
      arc: arcFn
    }
  }

  render() {
    const { fill, animated } = this.props;
    const { enterProps, exitProps, arc } = this.getPaths();

    return (
      <PosedArc
        pose="enter"
        arc={arc}
        animated={animated}
        enterProps={enterProps}
        exitProps={exitProps}
        fill={fill}
      />
    );
  }
}
