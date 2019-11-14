import React, { Component } from 'react';
import { ChartShallowDataShape } from '../common/data';
import { BarChartProps, BarChart } from './BarChart';
import { HistogramBarSeries } from './BarSeries';

interface HistogramBarChartProps extends BarChartProps {
  data: ChartShallowDataShape[];
}

export class HistogramBarChart extends Component<HistogramBarChartProps> {
  static defaultProps: Partial<HistogramBarChartProps> = {
    series: <HistogramBarSeries />
  };

  render() {
    return <BarChart {...this.props} />;
  }
}
