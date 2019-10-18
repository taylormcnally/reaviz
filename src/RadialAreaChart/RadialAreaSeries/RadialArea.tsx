import React, { Component, Fragment, ReactElement } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { radialArea, curveCardinalClosed, curveLinear } from 'd3-shape';
import { RadialGradient, RadialGradientProps } from '../../common/Gradient';
import { CloneElement } from '../../common/utils';
import { RadialInterpolationTypes } from '../../common/utils/interpolation';
import { MotionPath, DEFAULT_TRANSITION } from '../../common/Motion';

export interface RadialAreaProps {
  /**
   * Parsed data shape. Set internally by `RadialAreaChart`.
   */
  data: ChartInternalShallowDataShape[];

  /**
   * Whether to animate the enter/update/exit.
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
   * Interpolation for the area. Set internally by `RadialAreaSeries`.
   */
  interpolation: RadialInterpolationTypes;

  /**
   * Color for the area. Set internally by `RadialAreaSeries`.
   */
  color: any;

  /**
   * Id set internally by `RadialAreaSeries`.
   */
  id: string;

  /**
   * The inner radius for the chart center.
   */
  innerRadius: number;

  /**
   * The outer radius for the chart center.
   */
  outerRadius: number;

  /**
   * CSS classes to apply.
   */
  className?: any;

  /**
   * Gradient to apply to the area.
   */
  gradient: ReactElement<RadialGradientProps, typeof RadialGradient> | null;
}

export class RadialArea extends Component<RadialAreaProps> {
  static defaultProps: Partial<RadialAreaProps> = {
    gradient: <RadialGradient />
  };

  getFill(color: string) {
    const { id, gradient } = this.props;

    if (!gradient) {
      return color;
    }

    return `url(#${id}-gradient)`;
  }

  getPath(data: ChartInternalShallowDataShape[]) {
    const { xScale, yScale, innerRadius, interpolation } = this.props;
    const curve =
      interpolation === 'smooth' ? curveCardinalClosed : curveLinear;

    const radialFn = radialArea()
      .angle((d: any) => xScale(d.x))
      .innerRadius(_ => innerRadius)
      .outerRadius((d: any) => yScale(d.y))
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

  renderArea(fill: string) {
    const { data, className, yScale } = this.props;
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
        pointerEvents="none"
        className={className}
        fill={this.getFill(fill)}
      />
    );
  }

  render() {
    const { data, color, id, gradient, outerRadius } = this.props;
    const fill = color(data, 0);

    return (
      <Fragment>
        {this.renderArea(fill)}
        {gradient && (
          <CloneElement<RadialGradientProps>
            element={gradient}
            id={`${id}-gradient`}
            radius={outerRadius}
            color={fill}
          />
        )}
      </Fragment>
    );
  }
}
