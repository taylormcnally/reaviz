import React, { FC } from 'react';
import {
  StackedBarChart,
  StackedBarSeries,
  Bar,
  BarChartProps
} from '../BarChart';
import {
  Gradient,
  GradientStop,
  LinearYAxis,
  LinearXAxis,
  LinearYAxisTickSeries,
  LinearXAxisTickSeries,
  TooltipArea,
  ChartTooltip,
  TooltipTemplate,
  formatValue,
  ChartNestedDataShape
} from '../common';

export interface SonarChartProps extends BarChartProps {
  data: ChartNestedDataShape[];
}

export const SonarChart: FC<Partial<SonarChartProps>> = props => (
  <StackedBarChart
    {...props}
    margins={0}
    gridlines={null}
    series={
      <StackedBarSeries
        type="stackedDiverging"
        colorScheme="rgb(17, 207, 247)"
        tooltip={
          <TooltipArea
            tooltip={
              <ChartTooltip
                followCursor={true}
                modifiers={{
                  offset: '5px, 5px'
                }}
                content={(data, color) => {
                  const [first] = data.data;
                  const y = !first.metadata?.empty
                    ? `${formatValue(Math.abs(data.data[0].y))}`
                    : 0;

                  return (
                    <TooltipTemplate
                      color={color}
                      value={{
                        x: formatValue(data.x),
                        y
                      }}
                    />
                  );
                }}
              />
            }
          />
        }
        bar={[
          <Bar
            rounded={false}
            width={1}
            rangeLines={null}
            gradient={
              <Gradient
                stops={[
                  <GradientStop offset="5%" stopOpacity={0.7} key="start" />,
                  <GradientStop offset="90%" stopOpacity={1} key="stop" />
                ]}
              />
            }
          />,
          <Bar
            rounded={false}
            width={1}
            rangeLines={null}
            gradient={
              <Gradient
                stops={[
                  <GradientStop offset="5%" stopOpacity={1} key="stop" />,
                  <GradientStop offset="90%" stopOpacity={0.7} key="start" />
                ]}
              />
            }
          />
        ]}
      />
    }
    yAxis={
      <LinearYAxis
        type="value"
        axisLine={null}
        tickSeries={<LinearYAxisTickSeries line={null} label={null} />}
      />
    }
    xAxis={
      <LinearXAxis
        type="category"
        axisLine={null}
        tickSeries={<LinearXAxisTickSeries line={null} label={null} />}
      />
    }
  />
);
