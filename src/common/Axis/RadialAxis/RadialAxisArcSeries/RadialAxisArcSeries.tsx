import React, { Component, Fragment } from 'react';
import { RadialAxisArc, RadialAxisArcProps } from './RadialAxisArc';
import { range } from 'd3-array';
import { CloneElement } from '../../../utils/children';

export interface RadialAxisArcSeriesProps {
  arc: JSX.Element;
  count: number;
  padding: number;
  innerRadius: number;
  outerRadius: number;
}

export class RadialAxisArcSeries extends Component<RadialAxisArcSeriesProps> {
  static defaultProps: Partial<RadialAxisArcSeriesProps> = {
    padding: 50,
    count: 12,
    arc: <RadialAxisArc />
  };

  render() {
    const {
      count,
      padding,
      innerRadius,
      outerRadius,
      arc
    } = this.props;
    const arcs = range(count);
    const arcWidth = (outerRadius - innerRadius - count * padding) / count;

    return (
      <Fragment>
        {arcs.map(i => (
          <CloneElement<RadialAxisArcProps>
            element={arc}
            key={i}
            index={i}
            innerRadius={innerRadius}
            count={count}
            width={arcWidth}
            padding={padding}
          />
        ))}
      </Fragment>
    );
  }
}
