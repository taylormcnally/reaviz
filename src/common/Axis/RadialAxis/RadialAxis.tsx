import React, { Component, Fragment } from 'react';
import { RadialAxisLineSeries, RadialAxisLineSeriesProps } from './RadialAxisLineSeries';
import { RadialAxisTickSeries, RadialAxisTickSeriesProps } from './RadialAxisTickSeries';
import { RadialAxisArcSeries, RadialAxisArcSeriesProps } from './RadialAxisArcSeries';
import { CloneElement } from '../../utils/children';

interface RadialAxisProps {
  height: number;
  xScale: any;
  arcs: JSX.Element;
  ticks: JSX.Element | null;
  lines: JSX.Element | null;
}

export class RadialAxis extends Component<RadialAxisProps, {}> {
  static defaultProps: Partial<RadialAxisProps> = {
    arcs: <RadialAxisArcSeries />,
    ticks: <RadialAxisTickSeries />,
    lines: <RadialAxisLineSeries />
  };

  getArcWidth(chartRadius: number) {
    const { minRadius, count, padding } = this.props.arcs.props;
    return (chartRadius - minRadius - count * padding) / count;
  }

  render() {
    const { arcs, ticks, xScale, height, lines } = this.props;
    const chartRadius = height / 2 - 40;
    const arcWidth = this.getArcWidth(chartRadius);
    const outerRadius = chartRadius + arcWidth;
    const { minRadius, padding } = this.props.arcs.props;

    return (
      <Fragment>
        {arcs && (
          <CloneElement<RadialAxisArcSeriesProps>
            element={arcs}
            arcWidth={arcWidth}
          />
        )}
        {lines && (
          <CloneElement<RadialAxisLineSeriesProps>
            element={lines}
            height={height}
            arcWidth={arcWidth}
            minRadius={minRadius}
            padding={padding}
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
