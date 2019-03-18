import React, { Component, Fragment } from 'react';
import { RadialAxisTick, RadialAxisTickProps } from './RadialAxisTick';
import { CloneElement } from '../../../utils/children';
import { reduceTicks } from '../../../utils/ticks';

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

  getTicks(scale, count) {
    if (scale.ticks) {
      return scale.ticks.apply(scale, [count]);
    } else {
      const tickValues = scale.domain();
      return reduceTicks(tickValues, count);
    }
  }

  render() {
    const { scale, count, outerRadius, tick } = this.props;
    const ticks = this.getTicks(scale, count);

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
