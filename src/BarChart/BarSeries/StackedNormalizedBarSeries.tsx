import React, { Component } from 'react';
import { BarSeriesProps, BarSeries } from './BarSeries';
import { Bar } from './Bar';
import { RangeLines } from './RangeLines';
import { ChartTooltip, TooltipTemplate } from '../../common/Tooltip';
import { formatValue } from '../../common/utils/formatting';
import { Gradient, GradientStop } from '../../common/Gradient';

export class StackedNormalizedBarSeries extends Component<BarSeriesProps, {}> {
  static defaultProps: Partial<BarSeriesProps> = {
    ...BarSeries.defaultProps,
    type: 'stackedNormalized',
    bar: (
      <Bar
        rounded={false}
        gradient={
          <Gradient
            stops={[
              <GradientStop offset="5%" stopOpacity={0.1} key="start" />,
              <GradientStop offset="90%" stopOpacity={0.7} key="stop" />
            ]}
          />
        }
        rangeLines={<RangeLines type="top" strokeWidth={3} />}
        tooltip={
          <ChartTooltip
            content={data => {
              const x = `${data.key} ∙ ${formatValue(data.x)}`;
              const y = `${formatValue(data.value)} ∙ ${formatValue(
                Math.floor((data.y1 - data.y0) * 100)
              )}%`;
              return <TooltipTemplate value={{ y, x }} />;
            }}
          />
        }
      />
    )
  };

  render() {
    const { type, ...rest } = this.props;
    return <BarSeries type="stackedNormalized" {...rest} />;
  }
}
