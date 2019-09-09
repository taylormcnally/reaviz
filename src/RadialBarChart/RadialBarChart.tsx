import React, { Component, Fragment } from 'react';
import {
  ChartShallowDataShape,
  ChartInternalShallowDataShape,
  buildShallowChartData
} from '../common/data';
import { scaleBand } from 'd3-scale';
import { getYDomain } from '../common/utils/domains';
import { RadialBarSeries, RadialBarSeriesProps } from './RadialBarSeries';
import { memoize } from 'lodash-es';
import {
  ChartProps,
  ChartContainer,
  ChartContainerChildProps
} from '../common/containers';
import { CloneElement } from '../common/utils/children';
import { RadialAxis, RadialAxisProps } from '../common/Axis/RadialAxis';
import { getRadialYScale } from '../common/scales';
import { uniqueBy } from 'common';

export interface RadialBarChartProps extends ChartProps {
  data: ChartShallowDataShape[];
  series: JSX.Element;
  axis: JSX.Element | null;
  innerRadius: number;
}

export class RadialBarChart extends Component<RadialBarChartProps> {
  static defaultProps: Partial<RadialBarChartProps> = {
    innerRadius: 0.1,
    margins: 75,
    axis: <RadialAxis />,
    series: <RadialBarSeries />
  };

  getScales = memoize(
    (
      preData: ChartShallowDataShape[],
      innerRadius: number,
      outerRadius: number
    ) => {
      const data = buildShallowChartData(
        preData
      ) as ChartInternalShallowDataShape[];
      const xDomain = uniqueBy<ChartInternalShallowDataShape>(data, d => d.x);
      const yDomain = getYDomain({ data, scaled: false });

      const xScale = scaleBand()
        .range([0, 2 * Math.PI])
        .domain(xDomain as any[]);

      const yScale = getRadialYScale(innerRadius, outerRadius, yDomain);

      return {
        xScale,
        yScale,
        data
      };
    }
  );

  renderChart(containerProps: ChartContainerChildProps) {
    const { chartWidth, chartHeight, id } = containerProps;
    const { innerRadius, series, axis } = this.props;
    const outerRadius = Math.min(chartWidth, chartHeight) / 2;
    const { yScale, xScale, data } = this.getScales(
      this.props.data,
      innerRadius,
      outerRadius
    );

    return (
      <Fragment>
        {axis && (
          <CloneElement<RadialAxisProps>
            element={axis}
            xScale={xScale}
            height={chartHeight}
            width={chartWidth}
            innerRadius={innerRadius}
          />
        )}
        <CloneElement<RadialBarSeriesProps>
          element={series}
          id={id}
          data={data}
          xScale={xScale}
          yScale={yScale}
          innerRadius={innerRadius}
        />
      </Fragment>
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
        {props => this.renderChart(props)}
      </ChartContainer>
    );
  }
}
