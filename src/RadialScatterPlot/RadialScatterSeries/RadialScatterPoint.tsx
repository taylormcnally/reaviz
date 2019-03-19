import React, { Component, Fragment, createRef } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { radialLine } from 'd3-shape';

export interface RadialScatterPointProps {
  data: ChartInternalShallowDataShape;
  index: number;
  animated: boolean;
  xScale: any;
  yScale: any;
  color: any;
  id: string;
  className?: any;
  size?: ((d) => number) | number;
}

export class RadialScatterPoint extends Component<RadialScatterPointProps> {
  static defaultProps: Partial<RadialScatterPointProps> = {
    size: 3
  };

  getTranslate(data: ChartInternalShallowDataShape) {
    const { xScale, yScale } = this.props;

    const fn = radialLine()
      .radius((d: any) => yScale(d.y))
      .angle((d: any) => xScale(d.x));

    // Parse the generated path to get point coordinates
    // Ref: https://bit.ly/2CnZcPl
    const path = fn([data] as any);
    const coords = path.slice(1).slice(0, -1);
    const transform = `translate(${coords})`;

    return transform;
  }

  renderCircle(fill: string) {
    const { size, data } = this.props;
    const transform = this.getTranslate(data);
    const sizeVal = typeof size === 'function' ? size(data) : size;

    return (
      <circle
        r={sizeVal}
        fill={fill}
        transform={transform}
      />
    );
  }

  render() {
    const { data, index, color } = this.props;
    const fill = color(data, index);

    return (
      <Fragment>
        {this.renderCircle(fill)}
      </Fragment>
    );
  }
}
