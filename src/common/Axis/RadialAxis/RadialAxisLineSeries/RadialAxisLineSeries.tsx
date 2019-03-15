import React, { Component, Fragment } from 'react';
import { scaleLinear, scalePoint } from 'd3-scale';
import { range } from 'd3-array';
import { RadialAxisLine, RadialAxisLineProps } from './RadialAxisLine';
import { CloneElement } from '../../../utils/children';

export interface RadialAxisLineSeriesProps {
  minRadius: number;
  count: number;
  padding: number;
  arcWidth: number;
  height: number;
  line: JSX.Element;
}

export class RadialAxisLineSeries extends Component<RadialAxisLineSeriesProps> {
  static defaultProps: Partial<RadialAxisLineSeriesProps> = {
    count: 12,
    line: <RadialAxisLine />
  };

  getInnerArcRadius(arcWidth: number) {
    const { minRadius, count, padding } = this.props;
    return minRadius + (count - (count - 3)) * (arcWidth + padding);
  }

  render() {
    const { count, height, arcWidth, line } = this.props;
    const outerRadius = height / 2;
    const lines = range(count);
    const innerRadius = this.getInnerArcRadius(arcWidth);
    const radius = scaleLinear().range([innerRadius, outerRadius]);
    const angle = scalePoint()
      .domain(range(count + 1) as any)
      .range([0.75, 2.25 * Math.PI]);

    return (
      <Fragment>
        {lines.map((_, i) => (
          <CloneElement<RadialAxisLineProps>
            element={line}
            key={i}
            radius={radius}
            index={i}
            angle={angle}
          />
        ))}
      </Fragment>
    );
  }
}
