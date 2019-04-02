import React, { Component } from 'react';
import { ChartShallowDataShape } from '../../common/data';
import { CloneElement } from '../../common/utils/children';
import { RadialGaugeArcProps, RadialGaugeArc } from './RadialGaugeArc';
import { PoseGroup } from 'react-pose';
import { PoseSVGGElement } from '../../common/utils/animations';
import { RadialGaugeLabel, RadialGaugeLabelProps } from './RadialGaugeLabel';
import { RadialGaugeValueLabel } from './RadialGaugeValueLabel';

export interface RadialGaugeSeriesProps {
  data: ChartShallowDataShape;
  scale: any;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
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

  render() {
    const { scale, data, innerArc, outerArc, outerRadius, startAngle, endAngle, label, valueLabel } = this.props;
    const dataEndAngle = scale(data.data as number);

    return (
      <PoseGroup animateOnMount={innerArc.props.animated}>
        <PoseSVGGElement key="1">
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
      </PoseGroup>
    );
  }
}
