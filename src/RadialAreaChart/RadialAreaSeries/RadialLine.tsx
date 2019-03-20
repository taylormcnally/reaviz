import React, { Component } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { radialLine, curveCardinalClosed, curveLinear } from 'd3-shape';
import { PosedRadialArea } from './PosedRadialArea';
import { RadialInterpolationTypes } from '../../common/utils/interpolation';

export interface RadialLineProps {
  data: ChartInternalShallowDataShape[];
  animated: boolean;
  xScale: any;
  yScale: any;
  color: any;
  interpolation: RadialInterpolationTypes;
  strokeWidth: number;
  className?: any;
}

export class RadialLine extends Component<RadialLineProps> {
  static defaultProps: Partial<RadialLineProps> = {
    strokeWidth: 2
  };

  getPath(data: ChartInternalShallowDataShape[]) {
    const { xScale, yScale, interpolation } = this.props;
    const curve = interpolation === 'smooth' ? curveCardinalClosed : curveLinear;

    const radialFn = radialLine()
      .angle((d: any) => xScale(d.x))
      .radius((d: any) => yScale(d.y))
      .curve(curve);

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
