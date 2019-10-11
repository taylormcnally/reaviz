import React, { Component, Fragment, ReactElement } from 'react';
import {
  ChartShallowDataShape,
  ChartInternalShallowDataShape,
  buildShallowChartData
} from '../common/data';
import { scaleTime } from 'd3-scale';
import { getYDomain, getXDomain } from '../common/utils/domains';
import {
  ChartProps,
  ChartContainer,
  ChartContainerChildProps
} from '../common/containers';
import { CloneElement } from '../common/utils/children';
import { RadialAreaSeries, RadialAreaSeriesProps } from './RadialAreaSeries';
import { RadialAxis, RadialAxisProps } from '../common/Axis/RadialAxis';
import { getRadialYScale } from '../common/scales/radial';
import memoize from 'memoize-one';

export interface RadialAreaChartProps extends ChartProps {
  data: ChartShallowDataShape[];
  series: ReactElement<RadialAreaSeriesProps, typeof RadialAreaSeries>;
  innerRadius: number;
  axis: ReactElement<RadialAxisProps, typeof RadialAxis> | null;
}

export class RadialAreaChart extends Component<RadialAreaChartProps> {
  static defaultProps: Partial<RadialAreaChartProps> = {
    innerRadius: 80,
    series: <RadialAreaSeries />,
    axis: <RadialAxis />,
    margins: 75
  };

  getScales = memoize(
    (
      preData: ChartShallowDataShape[],
      outerRadius: number,
      innerRadius: number
    ) => {
      const data = buildShallowChartData(
        preData
      ) as ChartInternalShallowDataShape[];

      const yDomain = getYDomain({ data, scaled: false });
      const xDomain = getXDomain({ data });

      const xScale = scaleTime()
        .range([0, 2 * Math.PI])
        .domain(xDomain);

      const yScale = getRadialYScale(innerRadius, outerRadius, yDomain);

      return {
        yScale,
        xScale,
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
      outerRadius,
      innerRadius
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
        <CloneElement<RadialAreaSeriesProps>
          element={series}
          id={id}
          data={data}
          xScale={xScale}
          yScale={yScale}
          height={chartHeight}
          width={chartWidth}
          outerRadius={outerRadius}
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
        {this.renderChart.bind(this)}
      </ChartContainer>
    );
  }
}
