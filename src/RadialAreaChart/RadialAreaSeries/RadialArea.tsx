import React, { Component, Fragment } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { radialArea, curveCardinalClosed } from 'd3-shape';

export interface RadialAreaProps {
  data: ChartInternalShallowDataShape[];
  animated: boolean;
  xScale: any;
  yScale: any;
  color: any;
  id: string;
  className?: any;
  innerRadius: number;
}

export class RadialArea extends Component<RadialAreaProps> {
  static defaultProps: Partial<RadialAreaProps> = {
  };

  getArc(data: ChartInternalShallowDataShape[]) {
    const { xScale, yScale, innerRadius } = this.props;

    const radialFn = radialArea()
      .angle((d: any) => xScale(d.x))
      .innerRadius(d => innerRadius)
      .outerRadius((d: any) => yScale(d.y))
      .curve(curveCardinalClosed)

    return radialFn(data as any);

    /*
    const { innerRadius, xScale, yScale } = this.props;

    const outerRadius = yScale(data.y);
    const startAngle = xScale(data.x);
    const endAngle = xScale(data.x) + xScale.bandwidth();

    const arcFn = arc()
      .innerRadius(innerRadius)
      .outerRadius(() => outerRadius)
      .startAngle(() => startAngle)
      .endAngle(() => endAngle)
      .padAngle(0.01)
      .padRadius(innerRadius);

    return arcFn(data as any);
    */
  }

  render() {
    const { data, color, id } = this.props;

    const d = this.getArc(data);
    const fill = color(data, 0);

    return (
      <Fragment>
        <path
          d={d}
          fill={fill}
        />
      </Fragment>
    );
  }
}
