import React, { Component, Fragment } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { radialArea, curveCardinalClosed } from 'd3-shape';
import { RadialGradient, RadialGradientProps } from '../../common/Styles';
import { CloneElement } from '../../common/utils';

export interface RadialAreaProps {
  data: ChartInternalShallowDataShape[];
  animated: boolean;
  xScale: any;
  yScale: any;
  color: any;
  id: string;
  className?: any;
  innerRadius: number;
  gradient?: JSX.Element;
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

  getArc(data: ChartInternalShallowDataShape[]) {
    const { xScale, yScale, innerRadius } = this.props;

    const radialFn = radialArea()
      .angle((d: any) => xScale(d.x))
      .innerRadius(d => innerRadius)
      .outerRadius((d: any) => yScale(d.y))
      .curve(curveCardinalClosed)

    return radialFn(data as any);
  }

  render() {
    const { data, color, id, gradient, innerRadius } = this.props;

    const d = this.getArc(data);
    const fill = color(data, 0);

    return (
      <Fragment>
        <path
          d={d}
          fill={this.getFill(fill)}
        />
        {gradient && (
          <CloneElement<RadialGradientProps>
            element={gradient}
            id={`${id}-gradient`}
            radius={`${innerRadius}%`}
            color={fill}
          />
        )}
      </Fragment>
    );
  }
}
