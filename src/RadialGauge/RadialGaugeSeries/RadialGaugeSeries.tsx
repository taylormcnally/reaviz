import React, { Component } from 'react';
import { ChartShallowDataShape } from '../../common/data';
import { CloneElement } from '../../common/utils/children';
import { RadialGaugeArcProps, RadialGaugeArc } from './RadialGaugeArc';
import { PoseGroup } from 'react-pose';
import { PoseSVGGElement } from '../../common/utils/animations';
import { RadialGaugeLabel, RadialGaugeLabelProps } from './RadialGaugeLabel';
import { RadialGaugeValueLabel } from './RadialGaugeValueLabel';

export interface RadialGaugeSeriesProps {
  data: ChartShallowDataShape[];
  scale: any;
  startAngle: number;
  endAngle: number;
  width: number;
  innerArc: JSX.Element;
  outerArc: JSX.Element | null;
  label: JSX.Element | null;
  valueLabel: JSX.Element | null;
}

export class RadialGaugeSeries extends Component<RadialGaugeSeriesProps> {
  static defaultProps: Partial<RadialGaugeSeriesProps> = {
    outerArc: <RadialGaugeArc disabled={true} />,
    innerArc: <RadialGaugeArc width={20} fill="#00ECB1" animated={true} />,
    label: <RadialGaugeLabel />,
    valueLabel: <RadialGaugeValueLabel />
  };

  renderGauge(data: ChartShallowDataShape, index: number, width: number) {
    const { scale, innerArc, outerArc, startAngle, endAngle, label, valueLabel } = this.props;
    const dataEndAngle = scale(data.data as number);
    const outerRadius = (width / 2) - 10;
    const offset = (width * index) + outerRadius + 10;

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
        />
        {label && (
          <CloneElement<RadialGaugeLabelProps>
            element={label}
            data={data}
          />
        )}
        {valueLabel && (
          <CloneElement<RadialGaugeLabelProps>
            element={valueLabel}
            data={data}
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
