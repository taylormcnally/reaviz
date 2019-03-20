import React, { Component, Fragment } from 'react';
import { scaleLinear, scalePoint } from 'd3-scale';
import { range } from 'd3-array';
import { RadialAxisLine, RadialAxisLineProps } from './RadialAxisLine';
import { CloneElement } from '../../../utils/children';

export interface RadialAxisLineSeriesProps {
  innerRadius: number;
  outerRadius: number;
  count: number;
  arcWidth: number;
  line: JSX.Element;
}

export class RadialAxisLineSeries extends Component<RadialAxisLineSeriesProps> {
  static defaultProps: Partial<RadialAxisLineSeriesProps> = {
    count: 12,
    line: <RadialAxisLine />
  };

  render() {
    const { count, outerRadius, innerRadius, line } = this.props;
    const lines = range(count);
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
