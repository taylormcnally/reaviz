import React, { Component, Fragment, ReactElement } from 'react';
import { ChartShallowDataShape } from '../../common/data';
import { CloneElement } from '../../common/utils/children';
import { RadialGaugeArcProps, RadialGaugeArc } from './RadialGaugeArc';
import { RadialGaugeLabel, RadialGaugeLabelProps } from './RadialGaugeLabel';
import {
  RadialGaugeValueLabel,
  RadialGaugeValueLabelProps
} from './RadialGaugeValueLabel';
import { getColor, ColorSchemeType } from '../../common/color';
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
  colorScheme: ColorSchemeType;
  innerArc: ReactElement<RadialGaugeArcProps, typeof RadialGaugeArc>;
  outerArc: ReactElement<RadialGaugeArcProps, typeof RadialGaugeArc> | null;
  label: ReactElement<RadialGaugeLabelProps, typeof RadialGaugeLabel> | null;
  valueLabel: ReactElement<
    RadialGaugeValueLabelProps,
    typeof RadialGaugeValueLabel
  > | null;
  minGaugeWidth: number;
}

export class RadialGaugeSeries extends Component<RadialGaugeSeriesProps> {
  static defaultProps: Partial<RadialGaugeSeriesProps> = {
    outerArc: <RadialGaugeArc disabled={true} />,
    innerArc: <RadialGaugeArc width={10} animated={true} />,
    label: <RadialGaugeLabel />,
    valueLabel: <RadialGaugeValueLabel />,
    colorScheme: ['#00ECB1'],
    padding: 10,
    minGaugeWidth: 50
  };

  getWidths() {
    const { data, width, height, minGaugeWidth } = this.props;

    let rows = 1;
    let columns = data.length;

    if (width / data.length < minGaugeWidth) {
      while (width / columns < minGaugeWidth) {
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

  renderGauge(
    data: ChartShallowDataShape,
    index: number,
    columns: number,
    height: number,
    width: number,
    xScale,
    yScale
  ) {
    const {
      scale,
      innerArc,
      outerArc,
      startAngle,
      endAngle,
      label,
      valueLabel,
      padding
    } = this.props;

    const dataEndAngle = scale(data.data as number);

    const baselineLabelHeight = 20;
    const outerRadius =
      (min([
        width - padding,
        height - baselineLabelHeight - padding
      ]) as number) /
        2 -
      10;
    const labelOffset = height / 2 - baselineLabelHeight;

    const x = xScale(index % columns);
    const y = yScale(Math.floor(index / columns));

    const xOffset = x + (width - padding) / 2;
    const yOffset = y + (height - baselineLabelHeight) / 2;

    return (
      <g
        transform={`translate(${xOffset}, ${yOffset})`}
        key={data.key.toLocaleString()}
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
          color={getColor({
            data: this.props.data,
            colorScheme: this.props.colorScheme,
            point: data,
            index
          })}
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
      </g>
    );
  }

  render() {
    const { data } = this.props;
    const { columns, width, height, xScale, yScale } = this.getWidths();

    return (
      <Fragment>
        {data.map((d, i) =>
          this.renderGauge(d, i, columns, height, width, xScale, yScale)
        )}
      </Fragment>
    );
  }
}
