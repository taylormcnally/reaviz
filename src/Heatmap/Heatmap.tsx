import React, { Component } from 'react';
import classNames from 'classnames';
import {
  ChartProps,
  ChartContainer,
  ChartContainerChildProps
} from '../common/containers/ChartContainer';
import { ChartDataShape } from '../common/data';
// import { CloneElement } from '../common/utils/children';

interface HeatmapProps extends ChartProps {
  data: ChartDataShape[];
  series: JSX.Element;
}

export class Heatmap extends Component<HeatmapProps> {
  static defaultProps: HeatmapProps = {
    data: [],
    margins: 10,
    series: <g></g>
  };

  renderChart(containerProps: ChartContainerChildProps) {
    const { chartWidth, chartHeight } = containerProps;

    return <g></g>;
  }

  render() {
    const { id, width, height, margins, className } = this.props;

    return (
      <ChartContainer
        id={id}
        width={width}
        height={height}
        margins={margins}
        xAxisVisible={false}
        yAxisVisible={false}
        center={true}
        className={classNames(className)}
      >
        {props => this.renderChart(props)}
      </ChartContainer>
    );
  }
}
