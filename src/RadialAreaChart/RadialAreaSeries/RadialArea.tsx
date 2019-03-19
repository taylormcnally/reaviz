import React, { Component, Fragment } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { radialArea, curveCardinalClosed } from 'd3-shape';
import { RadialGradient, RadialGradientProps } from '../../common/Styles';
import { CloneElement } from '../../common/utils';
import { PosedRadialArea } from './PosedRadialArea';

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

  getPath(data: ChartInternalShallowDataShape[]) {
    const { xScale, yScale, innerRadius } = this.props;

    const radialFn = radialArea()
      .angle((d: any) => xScale(d.x))
      .innerRadius(d => innerRadius)
      .outerRadius((d: any) => yScale(d.y))
      .curve(curveCardinalClosed)

    return radialFn(data as any);
  }

  renderArea(fill: string) {
    const { data, className, animated } = this.props;
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
        fill={this.getFill(fill)}
      />
    );
  }

  render() {
    const { data, color, id, gradient, innerRadius } = this.props;
    const fill = color(data, 0);

    return (
      <Fragment>
        {this.renderArea(fill)}
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
