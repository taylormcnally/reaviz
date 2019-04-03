import React, { Component } from 'react';
import { ChartShallowDataShape } from '../../common/data';
import { CloneElement } from '../../common/utils/children';
import { RadialGaugeArcProps, RadialGaugeArc } from './RadialGaugeArc';
import { PoseGroup } from 'react-pose';
import { PoseSVGGElement } from '../../common/utils/animations';
import { RadialGaugeLabel, RadialGaugeLabelProps } from './RadialGaugeLabel';
import { RadialGaugeValueLabel } from './RadialGaugeValueLabel';
import { getColor } from '../../common/utils/color';
import { range, min } from 'd3-array';
import { scaleBand } from 'd3-scale';

export interface RadialGaugeSeriesProps {
  data: ChartShallowDataShape[];
  scale: any;
  startAngle: number;
  endAngle: number;
  width: number;
  height: number;
  padding: number;
  colorScheme: ((data, index: number) => string) | string[];
  innerArc: JSX.Element;
  outerArc: JSX.Element | null;
  label: JSX.Element | null;
  valueLabel: JSX.Element | null;
}

export class RadialGaugeSeries extends Component<RadialGaugeSeriesProps> {
  static defaultProps: Partial<RadialGaugeSeriesProps> = {
    outerArc: <RadialGaugeArc disabled={true} />,
    innerArc: <RadialGaugeArc width={10} animated={true} />,
    label: <RadialGaugeLabel />,
    valueLabel: <RadialGaugeValueLabel />,
    colorScheme: ['#00ECB1'],
    padding: 10
  };

  getColor(point, index) {
    const { colorScheme, data } = this.props;

    return Array.isArray(colorScheme)
      ? getColor(colorScheme, data)(index)
      : colorScheme(point, index);
  }

  getWidths() {
    const { data, width, height } = this.props;

    const minWidth = 150;
    let rows = 1;
    let columns = data.length;

    if ((width / data.length) < minWidth) {
      while (width / columns < minWidth) {
        rows += 1;
        columns = Math.ceil(data.length / rows);
      }
    }

    const xScale: any = scaleBand();
    xScale.domain(range(columns));
    xScale.rangeRound([0, width], 0.1);

    const yScale: any = scaleBand();
    yScale.domain(range(rows));
    yScale.rangeRound([0, height], 0.1);

    return {
      columns,
      xScale,
      yScale,
      width: xScale.bandwidth(),
      height: yScale.bandwidth()
    };
  }

  renderGauge(data: ChartShallowDataShape, index: number, columns: number, height: number, width: number, xScale, yScale) {
    const { scale, innerArc, outerArc, startAngle, endAngle, label, valueLabel, padding } = this.props;

    const dataEndAngle = scale(data.data as number);

    const baselineLabelHeight = 20;
    const outerRadius = (min([width - padding, height - baselineLabelHeight]) / 2) - 10;
    const labelOffset = (width / 2) - padding;

    const x = xScale(index % columns);
    const y = yScale(Math.floor(index / columns));

    const xOffset = x + (width - padding) / 2;
    const yOffset = y + (width - baselineLabelHeight) / 2;

    return (
      <PoseSVGGElement
        key={data.key.toString()}
        transform={`translate(${xOffset}, ${yOffset})`}
      >
        {outerArc && (
          <CloneElement<RadialGaugeArcProps>
            element={outerArc}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
          />
        )}
        <CloneElement<RadialGaugeArcProps>
          element={innerArc}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={dataEndAngle}
          data={data}
          color={this.getColor(data, index)}
        />
        {valueLabel && (
          <CloneElement<RadialGaugeLabelProps>
            element={valueLabel}
            data={data}
          />
        )}
        {label && (
          <CloneElement<RadialGaugeLabelProps>
            element={label}
            data={data}
            offset={labelOffset}
          />
        )}
      </PoseSVGGElement>
    );
  }

  render() {
    const { data, innerArc } = this.props;
    const { columns, width, height, xScale, yScale } = this.getWidths();

    return (
      <PoseGroup animateOnMount={innerArc.props.animated}>
        {data.map((d, i) => this.renderGauge(d, i, columns, height, width, xScale, yScale))}
      </PoseGroup>
    );
  }
}
