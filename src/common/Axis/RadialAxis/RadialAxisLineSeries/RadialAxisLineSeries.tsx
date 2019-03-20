import React, { Component, Fragment } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
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
    // TODO: Revisit later w/ better approach
    const lines = range(count * 2);
    const radius = scaleLinear().range([innerRadius, outerRadius]);
    const angle = scaleBand()
      .domain(lines as any)
      .range([0, 2 * Math.PI]);

    return (
      <Fragment>
        {lines.map((_, i) => (
          <Fragment>
            {i % 2 && (
              <CloneElement<RadialAxisLineProps>
                element={line}
                key={i}
                radius={radius}
                index={i}
                angle={angle}
              />
            )}
          </Fragment>
        ))}
      </Fragment>
    );
  }
}
