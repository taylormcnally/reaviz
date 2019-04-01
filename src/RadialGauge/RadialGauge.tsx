import React, { Component } from 'react';
import { ChartProps, ChartContainer, ChartContainerChildProps } from '../common/containers';
import { ChartShallowDataShape } from '../common/data';
import { scaleLinear } from 'd3-scale';
import { RadialGaugeArc, RadialGaugeArcProps } from './RadialGaugeArc';
import { CloneElement } from '../common/utils/children';
import { PoseGroup } from 'react-pose';
import { PoseSVGGElement } from '../common/utils/animations';

export interface RadialGaugeProps extends ChartProps {
  data: ChartShallowDataShape;
  minValue: number;
  maxValue: number;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerArc: JSX.Element;
  innerArc: JSX.Element;
}

export class RadialGauge extends Component<RadialGaugeProps> {
  static defaultProps: Partial<RadialGaugeProps> = {
    minValue: 0,
    maxValue: 100,
    startAngle: 0,
    endAngle: Math.PI * 2,
    outerArc: <RadialGaugeArc />,
    innerArc: <RadialGaugeArc width={20} fill="#00ECB1" animated={true} />
  };

  renderChart(containerProps: ChartContainerChildProps) {
    const { chartWidth, chartHeight } = containerProps;
    const { startAngle, endAngle, minValue, maxValue, data, outerArc, innerArc } = this.props;
    const outerRadius = Math.min(chartWidth, chartHeight) / 2;

    const scale = scaleLinear()
      .domain([minValue, maxValue])
      .range([startAngle, endAngle]);

    const dataEndAngle = scale(data.data as number);

    return (
      <PoseGroup animateOnMount={innerArc.props.animated}>
        <PoseSVGGElement key="1">
          <CloneElement<RadialGaugeArcProps>
            element={outerArc}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
          />
          <CloneElement<RadialGaugeArcProps>
            element={innerArc}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={dataEndAngle}
          />
        </PoseSVGGElement>
      </PoseGroup>
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
