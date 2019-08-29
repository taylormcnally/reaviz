import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { object, color, number } from '@storybook/addon-knobs';

import { ScatterPlot } from './ScatterPlot';
import {
  signalChartData,
  largeSignalChartData,
  medSignalChartData,
  signalStageData,
  signalStages
} from '../../demo/signals';
import { randomNumber } from '../../demo';
import { range } from 'd3-array';
import { GridlineSeries, Gridline, GridStripe } from '../common/Gridline';
import { ScatterSeries, ScatterPoint } from './ScatterSeries';
import {
  LinearYAxis,
  LinearYAxisTickSeries,
  LinearYAxisTickLabel
} from '../common/Axis/LinearAxis';
import { symbolStar, symbol } from 'd3-shape';

storiesOf('Charts/Scatter Plot', module)
  .add(
    'Simple',
    () => {
      const height = number('Height', 400);
      const width = number('Width', 750);
      const size = number('Size', 4);
      const fill = color('Color', '#418AD7');
      const data = object('Data', medSignalChartData);

      return (
        <ScatterPlot
          height={height}
          width={width}
          data={data}
          series={
            <ScatterSeries point={<ScatterPoint color={fill} size={size} />} />
          }
        />
      );
    },
    { options: { showAddonPanel: true } }
  )
  .add('Categorical Axis', () => (
    <ScatterPlot
      height={400}
      width={750}
      data={signalStageData}
      yAxis={
        <LinearYAxis
          type="category"
          domain={signalStages as any}
          tickSeries={
            <LinearYAxisTickSeries
              label={<LinearYAxisTickLabel rotation={false} />}
            />
          }
        />
      }
      gridlines={
        <GridlineSeries
          line={<Gridline direction="y" />}
          stripe={<GridStripe direction="y" />}
        />
      }
    />
  ))
  .add('No Animation', () => (
    <ScatterPlot
      height={400}
      width={750}
      data={medSignalChartData}
      series={<ScatterSeries animated={false} />}
    />
  ))
  .add('Performance', () =>
    range(15).map(i => (
      <div
        key={i}
        style={{
          width: '250px',
          height: '250px',
          border: 'solid 1px green',
          margin: '25px',
          display: 'inline-block'
        }}
      >
        <ScatterPlot data={medSignalChartData} />
      </div>
    ))
  )
  .add('Autosize', () => (
    <div style={{ width: '50vw', height: '50vh', border: 'solid 1px red' }}>
      <ScatterPlot data={medSignalChartData} />
    </div>
  ))
  .add('Symbols', () => (
    <ScatterPlot
      height={400}
      width={750}
      data={signalChartData}
      series={
        <ScatterSeries
          point={
            <ScatterPoint
              symbol={() => {
                const d = symbol()
                  .type(symbolStar)
                  .size(175)();

                return (
                  <path
                    d={d!}
                    style={{
                      fill: 'lime',
                      stroke: 'purple',
                      strokeWidth: 1.5
                    }}
                  />
                );
              }}
            />
          }
        />
      }
    />
  ))
  .add('Bubble', () => (
    <ScatterPlot
      height={400}
      width={750}
      data={largeSignalChartData}
      margins={20}
      series={
        <ScatterSeries
          point={
            <ScatterPoint
              color="rgba(174, 52, 255, .5)"
              size={v => v.meta.severity + 5}
            />
          }
        />
      }
    />
  ))
  .add('Live Update', () => <BubbleChartLiveUpdate />);

class BubbleChartLiveUpdate extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      data: largeSignalChartData.map(d => ({ ...d }))
    };
  }

  updateData = () => {
    const data = this.state.data.map(item => {
      item.data = randomNumber(1, 100);
      return { ...item };
    });

    this.setState({ data });
  };

  render() {
    return (
      <Fragment>
        <ScatterPlot
          height={400}
          width={750}
          data={this.state.data}
          margins={20}
          series={
            <ScatterSeries
              point={
                <ScatterPoint
                  color="rgba(174, 52, 255, .5)"
                  size={v => {
                    return v.meta.severity + 5;
                  }}
                />
              }
            />
          }
        />
        <br />
        <button onClick={this.updateData}>Update</button>
      </Fragment>
    );
  }
}
