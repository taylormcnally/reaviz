import React, { Component } from 'react';
import { ChartProps, ChartContainer, ChartContainerChildProps } from '../common/containers';
import { ChartShallowDataShape } from '../common/data';
import { scaleLinear } from 'd3-scale';
import { CloneElement } from '../common/utils/children';
import { RadialGaugeSeriesProps, RadialGaugeSeries } from './RadialGaugeSeries';

export interface RadialGaugeProps extends ChartProps {
  data: ChartShallowDataShape;
  minValue: number;
  maxValue: number;
  startAngle: number;
  endAngle: number;
  series: JSX.Element;
}

export class RadialGauge extends Component<RadialGaugeProps> {
  static defaultProps: Partial<RadialGaugeProps> = {
    minValue: 0,
    maxValue: 100,
    startAngle: 0,
    endAngle: Math.PI * 2,
    series: <RadialGaugeSeries />
  };

  renderChart(containerProps: ChartContainerChildProps) {
    const { chartWidth, chartHeight } = containerProps;
    const { startAngle, endAngle, minValue, maxValue, data, series } = this.props;
    const outerRadius = Math.min(chartWidth, chartHeight) / 2;

    const scale = scaleLinear()
      .domain([minValue, maxValue])
      .range([startAngle, endAngle]);

    return (
      <CloneElement<RadialGaugeSeriesProps>
        element={series}
        outerRadius={outerRadius}
        scale={scale}
        data={data}
        startAngle={startAngle}
        endAngle={endAngle}
      />
    );
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
        className={className}
      >
        {this.renderChart.bind(this)}
      </ChartContainer>
    );
  }
}
