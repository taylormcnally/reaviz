import React, { Component, Fragment, ReactElement } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { RadialBar, RadialBarProps } from './RadialBar';
import { CloneElement } from '../../common/utils/children';
import { ColorSchemeType, getColor } from '../../common/color';

export interface RadialBarSeriesProps {
  /**
   * Parsed data shape. Set internally by `RadialBarChart`.
   */
  data: ChartInternalShallowDataShape[];

  /**
   * Color scheme for the series.
   */
  colorScheme: ColorSchemeType;

  /**
   * The inner radius for the chart center.
   */
  innerRadius: number;

  /**
   * D3 scale for X Axis. Set internally by `RadialBarChart`.
   */
  xScale: any;

  /**
   * D3 scale for Y Axis. Set internally by `RadialBarChart`.
   */
  yScale: any;

  /**
   * Id set internally by `RadialBarChart`.
   */
  id: string;

  /**
   * Bar that is rendered.
   */
  bar: ReactElement<RadialBarProps, typeof RadialBar>;

  /**
   * Whether to animate the enter/update/exit.
   */
  animated: boolean;
}

export class RadialBarSeries extends Component<RadialBarSeriesProps> {
  static defaultProps: Partial<RadialBarSeriesProps> = {
    colorScheme: 'cybertron',
    bar: <RadialBar />,
    animated: true
  };

  renderBar(point: ChartInternalShallowDataShape, index: number) {
    const {
      innerRadius,
      xScale,
      yScale,
      bar,
      id,
      data,
      animated,
      colorScheme
    } = this.props;

    return (
      <Fragment key={index}>
        <CloneElement<RadialBarProps>
          element={bar}
          id={`radialbar-${id}-${index}`}
          index={index}
          data={point}
          xScale={xScale}
          yScale={yScale}
          innerRadius={innerRadius}
          color={(point, index) =>
            getColor({ data, point, index, colorScheme })
          }
          barCount={data.length}
          animated={animated}
        />
      </Fragment>
    );
  }

  render() {
    const { data } = this.props;

    return <Fragment>{data.map((d, i) => this.renderBar(d, i))}</Fragment>;
  }
}
