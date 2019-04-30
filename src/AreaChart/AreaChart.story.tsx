import React, { Fragment, Component } from 'react';
import { storiesOf } from '@storybook/react';
import chroma from 'chroma-js';
import { timeDay } from 'd3-time';
import { object, color, number, select } from '@storybook/addon-knobs';

import {
  multiDateData,
  singleDateData,
  singleDateBigIntData,
  randomNumber
} from '../common/demo';
import { AreaChart } from './AreaChart';
import { StackedNormalizedAreaChart } from './StackedNormalizedAreaChart';
import { StackedAreaChart } from './StackedAreaChart';
import { range } from 'd3-array';
import {
  AreaSeries,
  Area,
  Line,
  StackedAreaSeries,
  StackedNormalizedAreaSeries,
  PointSeries
} from './AreaSeries';
import { GridlineSeries, Gridline } from '../common/Gridline';
import { LinearXAxis, LinearXAxisTickSeries } from '../common/Axis/LinearAxis';
import { ScatterPoint } from '../ScatterPlot';
import { symbol, symbolStar } from 'd3-shape';
import { Gradient, GradientStop } from '../common/gradients';
import { Stripes } from 'reaviz/common/masks';

storiesOf('Charts/Area/Single Series', module)
  .add(
    'Simple',
    () => {
      const height = number('Height', 250);
      const width = number('Width', 350);
      const lineStroke = number('Stroke Width', 4);
      const fill = color('Color', '#418AD7');
      const interpolation = select(
        'Interpolation',
        {
          linear: 'linear',
          step: 'step',
          smooth: 'smooth'
        },
        'linear'
      );
      const data = object('Data', singleDateData);

      return (
        <AreaChart
          width={width}
          height={height}
          data={data}
          series={
            <AreaSeries
              interpolation={interpolation}
              colorScheme={[fill]}
              line={<Line strokeWidth={lineStroke} />}
            />
          }
        />
      );
    },
    { options: { showAddonPanel: true } }
  )
  .add('Masks', () => (
    <AreaChart
      width={350}
      height={250}
      data={singleDateData}
      series={
        <AreaSeries
          area={
            <Area
              mask={<Stripes />}
              gradient={
                <Gradient
                  stops={[
                    <GradientStop offset="10%" stopOpacity={0} />,
                    <GradientStop offset="80%" stopOpacity={1} />
                  ]}
                />
              }
            />
          }
          line={<Line strokeWidth={3} />}
        />
      }
    />
  ))
  .add('No Animation', () => (
    <AreaChart
      width={350}
      height={250}
      data={singleDateData}
      series={<AreaSeries animated={false} />}
    />
  ))
  .add('Interval', () => (
    <AreaChart
      width={350}
      height={250}
      data={singleDateData}
      xAxis={
        <LinearXAxis
          type="time"
          tickSeries={<LinearXAxisTickSeries interval={timeDay} />}
        />
      }
    />
  ))
  .add('Autosize', () => (
    <div style={{ width: '50vw', height: '50vh', border: 'solid 1px red' }}>
      <AreaChart data={singleDateData} />
    </div>
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
        <AreaChart data={singleDateData} />
      </div>
    ))
  )
  .add('Big Int', () => (
    <AreaChart width={350} height={250} data={singleDateBigIntData} />
  ));

storiesOf('Charts/Area/Multi Series', module)
  .add('Simple', () => (
    <AreaChart
      width={550}
      height={350}
      data={multiDateData}
      series={
        <AreaSeries
          colorScheme={chroma
            .scale(['27efb5', '00bfff'])
            .colors(multiDateData.length)}
        />
      }
    />
  ))
  .add('Live Updating', () => <LiveUpdatingStory />)
  .add('Custom Colors', () => (
    <AreaChart
      width={550}
      height={350}
      series={
        <AreaSeries
          colorScheme={(_data, index) => (index % 2 ? 'blue' : 'green')}
        />
      }
      data={multiDateData}
    />
  ))
  .add('Stacked', () => (
    <StackedAreaChart
      width={550}
      height={350}
      series={
        <StackedAreaSeries
          colorScheme={chroma
            .scale(['27efb5', '00bfff'])
            .colors(multiDateData.length)}
        />
      }
      data={multiDateData}
    />
  ))
  .add('Stacked Normalized', () => (
    <StackedNormalizedAreaChart
      width={550}
      height={350}
      data={multiDateData}
      series={
        <StackedNormalizedAreaSeries
          colorScheme={chroma
            .scale(['27efb5', '00bfff'])
            .colors(multiDateData.length)}
        />
      }
    />
  ));

storiesOf('Charts/Area/Gridlines', module)
  .add('All Axes', () => (
    <AreaChart
      width={350}
      height={250}
      data={singleDateData}
      gridlines={<GridlineSeries line={<Gridline direction="all" />} />}
    />
  ))
  .add('X-Axis', () => (
    <AreaChart
      width={350}
      height={250}
      data={singleDateData}
      gridlines={<GridlineSeries line={<Gridline direction="x" />} />}
    />
  ))
  .add('Y-Axis', () => (
    <AreaChart
      width={350}
      height={250}
      data={singleDateData}
      gridlines={<GridlineSeries line={<Gridline direction="y" />} />}
    />
  ));

storiesOf('Charts/Area/Circle Series', module)
  .add('On', () => (
    <AreaChart
      width={350}
      height={250}
      data={singleDateData}
      series={<AreaSeries symbols={<PointSeries show={true} />} />}
    />
  ))
  .add('Off', () => (
    <AreaChart
      width={350}
      height={250}
      data={singleDateData}
      series={<AreaSeries symbols={null} />}
    />
  ))
  .add('On Hover', () => (
    <AreaChart
      width={350}
      height={250}
      data={singleDateData}
      series={<AreaSeries symbols={<PointSeries show="hover" />} />}
    />
  ))
  .add('Only First', () => (
    <AreaChart
      width={350}
      height={250}
      data={singleDateData}
      series={<AreaSeries symbols={<PointSeries show="first" />} />}
    />
  ))
  .add('Only Last', () => (
    <AreaChart
      width={350}
      height={250}
      data={singleDateData}
      series={<AreaSeries symbols={<PointSeries show="last" />} />}
    />
  ))
  .add('Shapes', () => (
    <AreaChart
      width={350}
      height={250}
      data={singleDateData}
      series={
        <AreaSeries
          symbols={
            <PointSeries
              show={true}
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
      }
    />
  ));

class LiveUpdatingStory extends Component<any, any> {
  state = {
    data: multiDateData.map(d => ({ ...d }))
  };

  updateData = () => {
    const data = [...this.state.data];
    const idx = randomNumber(0, data.length - 1);
    const set = data[idx];

    const updateIndex = randomNumber(0, set.data.length - 1);
    set.data[updateIndex].data = randomNumber(10, 50);

    this.setState({ data });
  };

  render() {
    const data = this.state.data;
    return (
      <Fragment>
        <AreaChart
          width={550}
          height={350}
          series={
            <AreaSeries
              colorScheme={chroma
                .scale(['27efb5', '00bfff'])
                .colors(multiDateData.length)}
            />
          }
          data={data}
        />
        <br />
        <button onClick={this.updateData}>Update</button>
      </Fragment>
    );
  }
}
