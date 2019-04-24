import React, { Component, Fragment } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { radialArea, curveCardinalClosed, curveLinear } from 'd3-shape';
import { RadialGradient, RadialGradientProps } from '../../common/Styles';
import { CloneElement } from '../../common/utils';
import { PosedRadialArea } from './PosedRadialArea';
import { RadialInterpolationTypes } from '../../common/utils/interpolation';

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
    const curve = interpolation === 'smooth' ? curveCardinalClosed : curveLinear;

    const radialFn = radialArea()
      .angle((d: any) => xScale(d.x))
      .innerRadius(_ => innerRadius)
      .outerRadius((d: any) => yScale(d.y))
      .curve(curve);

    return radialFn(data as any);
  }

  renderArea(fill: string) {
    const { data, className, animated, yScale } = this.props;
    const enterProps = {
      d: this.getPath(data)
    };

    const [yStart] = yScale.domain();
    const exitProps = {
      d: this.getPath(data.map(d => ({ ...d, y: yStart })))
    };

    return (
      <PosedRadialArea
        pose="enter"
        poseKey={enterProps.d}
        animated={animated}
        pointerEvents="none"
        enterProps={enterProps}
        exitProps={exitProps}
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
