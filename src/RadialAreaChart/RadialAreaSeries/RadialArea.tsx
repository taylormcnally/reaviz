import React, { Component, Fragment } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { radialArea, curveCardinalClosed, curveLinear } from 'd3-shape';
import { RadialGradient, RadialGradientProps } from '../../common/Gradient';
import { CloneElement } from '../../common/utils';
import { RadialInterpolationTypes } from '../../common/utils/interpolation';
import { MotionPath, DEFAULT_TRANSITION } from '../../common/Motion';

export interface RadialAreaProps {
  data: ChartInternalShallowDataShape[];
  animated: boolean;
  xScale: any;
  yScale: any;
  interpolation: RadialInterpolationTypes;
  color: any;
  id: string;
  innerRadius: number;
  outerRadius: number;
  className?: any;
  gradient: JSX.Element | null;
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
