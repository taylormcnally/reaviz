import { storiesOf } from '@storybook/react';
import React from 'react';

import {
  singleDateData,
  medDateData,
  smallDateData,
  sonarData
} from '../../demo';
import { SparklineChart } from './SparklineChart';
import { AreaSparklineChart } from './AreaSparklineChart';
import { BarSparklineChart } from './BarSparklineChart';
import { StackedBarChart, StackedBarSeries, Bar } from '../BarChart';
import {
  Gradient,
  GradientStop,
  LinearYAxis,
  LinearXAxis,
  LinearYAxisTickSeries,
  LinearXAxisTickSeries
} from '../common';

storiesOf('Demos|Sparkline', module)
  .add('Line', () => (
    <SparklineChart width={200} height={55} data={medDateData} />
  ))
  .add('Area', () => (
    <AreaSparklineChart width={200} height={85} data={singleDateData} />
  ))
  .add('Bar', () => (
    <BarSparklineChart width={200} height={55} data={smallDateData} />
  ))
  .add('Sonar', () => (
    <StackedBarChart
      width={300}
      height={50}
      margins={0}
      data={sonarData}
      gridlines={null}
      series={
        <StackedBarSeries
          type="stackedDiverging"
          colorScheme="rgb(17, 207, 247)"
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
  ));
