import React, { Component, Fragment } from 'react';
import { RadialAxisArc, RadialAxisArcProps } from './RadialAxisArc';
import { range } from 'd3-array';
import { CloneElement } from '../../../utils/children';

export interface RadialAxisArcSeriesProps {
  arc: JSX.Element;
  count: number;
  padding: number;
  minRadius: number;
  arcWidth: number;
}

export class RadialAxisArcSeries extends Component<RadialAxisArcSeriesProps> {
  static defaultProps: Partial<RadialAxisArcSeriesProps> = {
    padding: 50,
    minRadius: 10,
    count: 13,
    arc: <RadialAxisArc />
  };

  render() {
    const {
      count,
      padding,
      minRadius,
      arc,
      arcWidth
    } = this.props;
    const arcs = range(count);

    return (
      <Fragment>
        {arcs.map(i => (
          <CloneElement<RadialAxisArcProps>
            element={arc}
            key={i}
            index={i}
            minRadius={minRadius}
            count={count}
            width={arcWidth}
            padding={padding}
          />
        ))}
      </Fragment>
    );
  }
}
