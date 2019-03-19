import React, { Component, Fragment } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { radialLine, curveCardinalClosed } from 'd3-shape';
import { PosedRadialArea } from './PosedRadialArea';

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
    const { data, color, strokeWidth, animated, className } = this.props;
    const fill = color(data, 0);

    const enterProps = {
      d: this.getPath(data)
    };

    const exitProps = {
      d: this.getPath(data.map(d => ({ ...d, y: 0 })))
    };

    return (
      <PosedRadialArea
        pose="enter"
        poseKey={enterProps.d}
        animated={animated}
        enterProps={enterProps}
        exitProps={exitProps}
        className={className}
        stroke={fill}
        fill="none"
        strokeWidth={strokeWidth}
      />
    );
  }
}
