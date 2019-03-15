import React, { Component, Fragment } from 'react';
import { RadialAxisTick, RadialAxisTickProps } from './RadialAxisTick';
import { CloneElement } from '../../../utils/children';

export interface RadialAxisTickSeriesProps {
  scale: any;
  count: number;
  outerRadius: number;
  tick: JSX.Element | null;
}

export class RadialAxisTickSeries extends Component<RadialAxisTickSeriesProps> {
  static defaultProps: Partial<RadialAxisTickSeriesProps> = {
    count: 12,
    tick: <RadialAxisTick />
  };

  render() {
    const { scale, count, outerRadius, tick } = this.props;
    const ticks = scale.ticks(count);

    return (
      <Fragment>
        {ticks.map((data, i) => (
          <CloneElement<RadialAxisTickProps>
            element={tick}
            key={i}
            index={i}
            scale={scale}
            data={data}
            outerRadius={outerRadius}
          />
        ))}
      </Fragment>
    );
  }
}
