import React, { Component } from 'react';
import { arc } from 'd3-shape';
import { PieArc } from '../../PieChart';
import { ChartShallowDataShape } from '../../common/data';

export interface RadialGaugeArcProps {
  data?: ChartShallowDataShape;
  startAngle: number;
  endAngle: number;
  outerRadius: number;
  fill: string;
  width: number;
  animated: boolean;
  disabled: boolean;
}

export class RadialGaugeArc extends Component<RadialGaugeArcProps> {
  static defaultProps: Partial<RadialGaugeArcProps> = {
    width: 10,
    fill: '#353d44',
    animated: false,
    disabled: false
  };

  getPaths() {
    const { outerRadius, startAngle, endAngle, width, data } = this.props;

    // Calculate the inner rad based on the width
    // and the outer rad which is height/width / 2
    const innerRadius = outerRadius - width;

    // Center arcs so inner/outer align nicely
    const delta = (outerRadius - innerRadius) / 2;
    const newInnerRad = innerRadius + delta;
    const newOuterRad = outerRadius + delta;

    // Create the arc fn to pass to the pie arc
    const innerArc = arc()
      .innerRadius(newInnerRad)
      .outerRadius(newOuterRad);

    return {
      data: {
        startAngle,
        endAngle,
        // Data must be passed
        data: data || {}
      },
      innerArc
    }
  }

  render() {
    const { fill, animated, disabled } = this.props;
    const data = this.getPaths();

    return (
      <PieArc
        {...data}
        animated={animated}
        color={fill}
        disabled={disabled}
      />
    );
  }
}
