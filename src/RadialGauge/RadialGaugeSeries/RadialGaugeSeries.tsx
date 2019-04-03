import React, { Component } from 'react';
import { ChartShallowDataShape } from '../../common/data';
import { CloneElement } from '../../common/utils/children';
import { RadialGaugeArcProps, RadialGaugeArc } from './RadialGaugeArc';
import { PoseGroup } from 'react-pose';
import { PoseSVGGElement } from '../../common/utils/animations';
import { RadialGaugeLabel, RadialGaugeLabelProps } from './RadialGaugeLabel';
import { RadialGaugeValueLabel } from './RadialGaugeValueLabel';
import { getColor } from '../../common/utils/color';

export interface RadialGaugeSeriesProps {
  data: ChartShallowDataShape[];
  scale: any;
  startAngle: number;
  endAngle: number;
  width: number;
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

  renderGauge(data: ChartShallowDataShape, index: number, width: number) {
    const { scale, innerArc, outerArc, startAngle, endAngle, label, valueLabel, padding } = this.props;
    const dataEndAngle = scale(data.data as number);
    const outerRadius = (width / 2) - padding * 2;
    const offset = (width * index) + outerRadius + padding * 2;
    const labelOffset = (width / 2) - padding;

    return (
      <PoseSVGGElement
        key={data.key.toString()}
        transform={`translate(${offset}, 0)`}
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
    const { data, innerArc, width } = this.props;
    const widthDist = width / data.length;

    return (
      <PoseGroup animateOnMount={innerArc.props.animated}>
        {data.map((d, i) => this.renderGauge(d, i, widthDist))}
      </PoseGroup>
    );
  }
}
