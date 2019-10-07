import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  largeSignalChartData,
  categoryData,
  binnedDateData
} from '../../../../demo';
import { ScatterPlot } from '../../../ScatterPlot';
import {
  BarChart,
  StackedBarChart,
  StackedBarSeries,
  RangeLines,
  Bar
} from '../../../BarChart';
import {
  LinearYAxis,
  LinearYAxisTickSeries,
  LinearYAxisTickLine,
  LinearYAxisTickLabel
} from './LinearYAxis';
import {
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLine,
  LinearXAxisTickLabel
} from './LinearXAxis';
import { GridlineSeries, Gridline } from '../../Gridline';
import { getYScale, getXScale } from '../../scales';
import { LinearAxisLine } from './LinearAxisLine';
import { Gradient, GradientStop } from '../../Gradient';

storiesOf('Demos|Axis/Linear', module)
  .add('Center Axes', () => {
    const data = [...largeSignalChartData].splice(0, 50);
    return (
      <ScatterPlot
        height={400}
        width={400}
        data={data}
        gridlines={null}
        yAxis={
          <LinearYAxis
            type="value"
            position="center"
            tickSeries={
              <LinearYAxisTickSeries
                line={<LinearYAxisTickLine position="center" />}
                label={<LinearYAxisTickLabel padding={3} />}
              />
            }
          />
        }
        xAxis={
          <LinearXAxis
            type="category"
            position="center"
            tickSeries={
              <LinearXAxisTickSeries
                line={<LinearXAxisTickLine position="center" />}
                label={<LinearXAxisTickLabel padding={3} />}
              />
            }
          />
        }
      />
    );
  })
  .add('Custom Label Rotation', () => (
    <BarChart
      width={350}
      height={350}
      data={categoryData}
      xAxis={
        <LinearXAxis
          type="category"
          tickSeries={
            <LinearXAxisTickSeries
              label={<LinearXAxisTickLabel rotation={-90} />}
            />
          }
        />
      }
    />
  ))
  .add('Left + Right Axis', () => {
    const scale = getYScale({
      type: 'category',
      height: 200,
      data: [
        {
          key: 'Closed',
          data: 0,
          y: 'Closed'
        },
        {
          key: 'Opened',
          data: 0,
          y: 'Opened'
        }
      ],
      isMultiSeries: false,
      isDiverging: true
    });

    return (
      <StackedBarChart
        width={450}
        height={200}
        margins={0}
        data={binnedDateData}
        gridlines={<GridlineSeries line={<Gridline direction="y" />} />}
        series={
          <StackedBarSeries
            type="stackedDiverging"
            colorScheme={['#ACB7C9', '#418AD7']}
            bar={
              <Bar
                rounded={false}
                width={25}
                gradient={
                  <Gradient
                    stops={[
                      <GradientStop
                        offset="5%"
                        stopOpacity={0.1}
                        key="start"
                      />,
                      <GradientStop offset="90%" stopOpacity={0.7} key="stop" />
                    ]}
                  />
                }
                rangeLines={<RangeLines type="top" strokeWidth={3} />}
              />
            }
          />
        }
        yAxis={
          <LinearYAxis
            roundDomains={true}
            position="end"
            axisLine={null}
            tickSeries={
              <LinearYAxisTickSeries
                line={null}
                label={
                  <LinearYAxisTickLabel
                    padding={5}
                    position="end"
                    format={d => `${d < 0 ? d * -1 : d}`}
                  />
                }
              />
            }
          />
        }
        yAxisSecondary={
          <LinearYAxis
            type="category"
            position="start"
            axisLine={null}
            scale={scale}
            tickSeries={
              <LinearYAxisTickSeries
                line={null}
                label={
                  <LinearYAxisTickLabel
                    padding={20}
                    position="start"
                    rotation={270}
                    align="start"
                  />
                }
              />
            }
          />
        }
        xAxis={
          <LinearXAxis
            type="category"
            position="center"
            tickSeries={<LinearXAxisTickSeries line={null} label={null} />}
          />
        }
      />
    );
  })
  .add('Top + Bottom Axis', () => {
    const scale = getXScale({
      type: 'category',
      width: 450,
      data: [
        {
          key: 'Closed',
          data: 0,
          x: 'Closed'
        },
        {
          key: 'Opened',
          data: 0,
          x: 'Opened'
        }
      ],
      isMultiSeries: false,
      isDiverging: true
    });

    return (
      <StackedBarChart
        width={450}
        height={200}
        margins={0}
        data={binnedDateData}
        gridlines={<GridlineSeries line={<Gridline direction="x" />} />}
        series={
          <StackedBarSeries
            layout="horizontal"
            type="stackedDiverging"
            colorScheme={['#ACB7C9', '#418AD7']}
            bar={
              <Bar
                rounded={false}
                width={25}
                gradient={
                  <Gradient
                    stops={[
                      <GradientStop
                        offset="5%"
                        stopOpacity={0.1}
                        key="start"
                      />,
                      <GradientStop offset="90%" stopOpacity={0.7} key="stop" />
                    ]}
                  />
                }
                rangeLines={<RangeLines type="top" strokeWidth={3} />}
              />
            }
          />
        }
        xAxis={
          <LinearYAxis
            orientation="horizontal"
            position="end"
            tickSeries={
              <LinearYAxisTickSeries
                line={null}
                label={
                  <LinearYAxisTickLabel
                    padding={5}
                    position="end"
                    format={d => `${d < 0 ? d * -1 : d}`}
                  />
                }
              />
            }
          />
        }
        xAxisSecondary={
          <LinearYAxis
            orientation="horizontal"
            type="category"
            scale={scale}
            tickSeries={
              <LinearYAxisTickSeries
                line={null}
                label={<LinearYAxisTickLabel padding={20} position="start" />}
              />
            }
          />
        }
        yAxis={
          <LinearXAxis
            type="category"
            position="center"
            orientation="vertical"
            tickSeries={<LinearXAxisTickSeries line={null} label={null} />}
          />
        }
      />
    );
  });
