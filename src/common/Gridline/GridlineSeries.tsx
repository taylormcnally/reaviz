import React, { Fragment, Component } from 'react';
import { Gridline, GridlineProps } from './Gridline';
import { getTicks, getMaxTicks } from '../utils/ticks';
import { CloneElement } from '../utils/children';
import { LinearAxisProps } from '../Axis';
import { GridStripeProps } from './GridStripe';

export interface GridlineSeriesProps {
  yScale: any;
  xScale: any;
  yAxis: LinearAxisProps;
  xAxis: LinearAxisProps;
  height: number;
  width: number;
  line: JSX.Element | null;
  stripe: JSX.Element | null;
}

export class GridlineSeries extends Component<GridlineSeriesProps> {
  static defaultProps: Partial<GridlineSeriesProps> = {
    line: <Gridline />,
    stripe: null
  };

  getGridlines() {
    const { yScale, xScale, yAxis, xAxis, height, width } = this.props;

    return {
      yAxisGrid: getTicks(
        yScale,
        yAxis.tickSeries.props.tickValues,
        yAxis.type,
        getMaxTicks(yAxis.tickSeries.props.tickSize, height),
        yAxis.tickSeries.props.interval
      ),
      xAxisGrid: getTicks(
        xScale,
        xAxis.tickSeries.props.tickValues,
        xAxis.type,
        getMaxTicks(xAxis.tickSeries.props.tickSize, width),
        xAxis.tickSeries.props.interval
      )
    };
  }

  renderSeries(
    yAxisGrid,
    xAxisGrid,
    element: JSX.Element,
    type: 'line' | 'stripe'
  ) {
    const { xScale, yScale } = this.props;

    return (
      <Fragment>
        {this.shouldRenderY(element.props.direction) &&
          this.renderGroup(element, yAxisGrid, yScale, 'y', type)}
        {this.shouldRenderX(element.props.direction) &&
          this.renderGroup(element, xAxisGrid, xScale, 'x', type)}
      </Fragment>
    );
  }

  shouldRenderY(direction: 'all' | 'x' | 'y') {
    return direction === 'all' || direction === 'y';
  }

  shouldRenderX(direction: 'all' | 'x' | 'y') {
    return direction === 'all' || direction === 'x';
  }

  getSkipIndex(direction: 'x' | 'y') {
    const { yAxis, xAxis } = this.props;

    if (
      (direction === 'x' &&
        yAxis.axisLine !== null &&
        yAxis.position === 'start') ||
      (direction === 'y' && xAxis.axisLine !== null && xAxis.position === 'end')
    ) {
      return 0;
    }

    return null;
  }

  renderGroup(
    element: JSX.Element,
    grid,
    scale,
    direction: 'x' | 'y',
    type: 'line' | 'stripe'
  ) {
    const { height, width } = this.props;
    const skipIdx = this.getSkipIndex(direction);

    return grid.map((point, index) => (
      <Fragment key={`${type}-${direction}-${index}`}>
        {index !== skipIdx && (
          <CloneElement<GridlineProps | GridStripeProps>
            element={element}
            index={index}
            scale={scale}
            data={point}
            height={height}
            width={width}
            direction={direction}
          />
        )}
      </Fragment>
    ));
  }

  render() {
    const { line, stripe } = this.props;
    const { yAxisGrid, xAxisGrid } = this.getGridlines();

    return (
      <g style={{ pointerEvents: 'none' }}>
        {line && this.renderSeries(yAxisGrid, xAxisGrid, line, 'line')}
        {stripe && this.renderSeries(yAxisGrid, xAxisGrid, stripe, 'stripe')}
      </g>
    );
  }
}
