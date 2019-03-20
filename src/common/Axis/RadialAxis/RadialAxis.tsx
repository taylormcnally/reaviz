import React, { Component, Fragment } from 'react';
import { RadialAxisLineSeries, RadialAxisLineSeriesProps } from './RadialAxisLineSeries';
import { RadialAxisTickSeries, RadialAxisTickSeriesProps } from './RadialAxisTickSeries';
import { RadialAxisArcSeries, RadialAxisArcSeriesProps } from './RadialAxisArcSeries';
import { CloneElement } from '../../utils/children';

export interface RadialAxisProps {
  height: number;
  width: number;
  xScale: any;
  innerRadius: number;
  arcs: JSX.Element | null;
  ticks: JSX.Element | null;
  lines: JSX.Element | null;
}

export class RadialAxis extends Component<RadialAxisProps, {}> {
  static defaultProps: Partial<RadialAxisProps> = {
    innerRadius: 10,
    arcs: <RadialAxisArcSeries />,
    ticks: <RadialAxisTickSeries />,
    lines: <RadialAxisLineSeries />
  };

  render() {
    const { arcs, ticks, xScale, height, width, lines, innerRadius } = this.props;
    const outerRadius = Math.min(height, width) / 2;

    return (
      <Fragment>
        {arcs && (
          <CloneElement<RadialAxisArcSeriesProps>
            element={arcs}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
          />
        )}
        {lines && (
          <CloneElement<RadialAxisLineSeriesProps>
            element={lines}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
          />
        )}
        {ticks && (
          <CloneElement<RadialAxisTickSeriesProps>
            element={ticks}
            scale={xScale}
            outerRadius={outerRadius}
          />
        )}
      </Fragment>
    );
  }
}
