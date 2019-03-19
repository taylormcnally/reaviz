import React, { Component, Fragment } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { radialLine, curveCardinalClosed } from 'd3-shape';

export interface RadialLineProps {
  data: ChartInternalShallowDataShape[];
  animated: boolean;
  xScale: any;
  yScale: any;
  color: any;
  strokeWidth: number;
  className?: any;
}

export class RadialLine extends Component<RadialLineProps> {
  static defaultProps: Partial<RadialLineProps> = {
    strokeWidth: 2
  };

  getPath(data: ChartInternalShallowDataShape[]) {
    const { xScale, yScale } = this.props;

    const radialFn = radialLine()
      .angle((d: any) => xScale(d.x))
      .radius((d: any) => yScale(d.y))
      .curve(curveCardinalClosed)

    return radialFn(data as any);
  }

  render() {
    const { data, color, strokeWidth } = this.props;

    const d = this.getPath(data);
    const fill = color(data, 0);

    return (
      <Fragment>
        <path
          d={d}
          stroke={fill}
          fill="none"
          strokeWidth={strokeWidth}
        />
      </Fragment>
    );
  }
}
