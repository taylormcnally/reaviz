import React, { Component } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { radialLine, curveCardinalClosed, curveLinear } from 'd3-shape';
import { RadialInterpolationTypes } from '../../common/utils/interpolation';
import { MotionPath, DEFAULT_TRANSITION } from '../../common/Motion';

export interface RadialLineProps {
  /**
   * Parsed data shape. Set internally by `RadialAreaChart`.
   */
  data: ChartInternalShallowDataShape[];

  /**
   * Whether to animate the enter/update/exit. Set internally by `RadialAreaSeries`.
   */
  animated: boolean;

  /**
   * D3 scale for X Axis. Set internally by `RadialAreaChart`.
   */
  xScale: any;

  /**
   * D3 scale for Y Axis. Set internally by `RadialAreaChart`.
   */
  yScale: any;

  /**
   * Color for the area. Set internally by `RadialAreaSeries`.
   */
  color: any;

  /**
   * Interpolation for the area. Set internally by `RadialAreaSeries`.
   */
  interpolation: RadialInterpolationTypes;

  /**
   * Stroke width of the line.
   */
  strokeWidth: number;

  /**
   * CSS classes to apply.
   */
  className?: any;
}

export class RadialLine extends Component<RadialLineProps> {
  static defaultProps: Partial<RadialLineProps> = {
    strokeWidth: 2
  };

  getPath(data: ChartInternalShallowDataShape[]) {
    const { xScale, yScale, interpolation } = this.props;
    const curve =
      interpolation === 'smooth' ? curveCardinalClosed : curveLinear;

    const radialFn = radialLine()
      .angle((d: any) => xScale(d.x))
      .radius((d: any) => yScale(d.y))
      .curve(curve);

    return radialFn(data as any);
  }

  getTransition() {
    const { animated } = this.props;

    if (animated) {
      return {
        ...DEFAULT_TRANSITION
      };
    } else {
      return {
        type: false,
        delay: 0
      };
    }
  }

  render() {
    const { data, color, strokeWidth, className, yScale } = this.props;
    const fill = color(data, 0);
    const transition = this.getTransition();
    const enter = {
      d: this.getPath(data),
      opacity: 1
    };

    const [yStart] = yScale.domain();
    const exit = {
      d: this.getPath(data.map(d => ({ ...d, y: yStart }))),
      opacity: 0
    };

    return (
      <MotionPath
        custom={{
          enter,
          exit
        }}
        transition={transition}
        className={className}
        pointerEvents="none"
        stroke={fill}
        fill="none"
        strokeWidth={strokeWidth}
      />
    );
  }
}
