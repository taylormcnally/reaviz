import React, { Fragment, Component } from 'react';
import { Bar, BarProps } from './Bar';
import {
  ChartInternalDataShape,
  ChartInternalNestedDataShape,
  ChartInternalShallowDataShape,
  Direction
} from '../../common/data';
import { PoseGroup } from 'react-pose';
import { PoseSVGGElement } from '../../common/utils/animations';
import { sequentialScheme, getColor } from '../../common/utils/color';
import { CloneElement } from '../../common/utils/children';
import { ThresholdCountGenerator, ThresholdArrayGenerator } from 'd3-array';
import { CountableTimeInterval } from 'd3-time';

export interface BarSeriesProps {
  data: ChartInternalDataShape[];
  id: string;
  xScale: any;
  xScale1: any;
  yScale: any;
  bar: JSX.Element;
  type: 'standard' | 'grouped' | 'stacked' | 'stackedNormalized' | 'marimekko' | 'waterfall';
  colorScheme: ((data, index: number) => string) | string[];
  animated: boolean;
  padding: number;
  groupPadding: number;
  isCategorical: boolean;
  layout: Direction;
  /**
   * Threshold for the binning of histogram charts.
   */
  binThreshold?:
    | number
    | ThresholdCountGenerator
    | ArrayLike<number | Date>
    | ThresholdArrayGenerator
    | CountableTimeInterval;
}

export class BarSeries extends Component<BarSeriesProps> {
  static defaultProps: Partial<BarSeriesProps> = {
    type: 'standard',
    padding: 0.1,
    groupPadding: 16,
    animated: true,
    colorScheme: [...sequentialScheme],
    bar: <Bar />,
    layout: 'vertical'
  };

  /**
   * Get the translation for the bar group.
   */
  getTransform(data: ChartInternalNestedDataShape) {
    const { xScale, yScale, type, layout } = this.props;

    let xPos = 0;
    let yPos = 0;
    if (type !== 'marimekko') {
      if (layout === 'vertical') {
        const val = xScale(data.key);
        xPos = val;
      } else {
        const val = yScale(data.key);
        yPos = val;
      }
    }

    return `translate(${xPos}, ${yPos})`;
  }

  getColor(point, index) {
    const { colorScheme, data } = this.props;

    return Array.isArray(colorScheme)
      ? getColor(colorScheme, data)(index)
      : colorScheme(point, index);
  }

  renderBar(
    data: ChartInternalShallowDataShape,
    barIndex: number,
    barCount: number,
    groupIndex?: number
  ) {
    const {
      xScale1,
      bar,
      padding,
      animated,
      isCategorical,
      layout
    } = this.props;

    const isVertical = layout === 'vertical';
    let yScale = this.props.yScale;
    let xScale = this.props.xScale;

    if (xScale1) {
      if (isVertical) {
        xScale = xScale1;
      } else {
        yScale = xScale1;
      }
    }

    // Histograms dont have keys
    let key = barIndex.toString();
    if (data.key) {
      key = `${data.key!.toString()}-${data.x!.toString()}`;
    }

    return (
      <PoseSVGGElement key={key}>
        <CloneElement<BarProps>
          element={bar}
          id={`bar-${groupIndex}-${barIndex}`}
          animated={animated}
          xScale={xScale}
          xScale1={xScale1}
          yScale={yScale}
          padding={padding}
          barCount={barCount}
          groupIndex={groupIndex}
          barIndex={barIndex}
          data={data}
          isCategorical={isCategorical}
          color={this.getColor.bind(this)}
          layout={layout}
        />
      </PoseSVGGElement>
    );
  }

  /**
   * Get the bar group.
   */
  renderBarGroup(
    data: ChartInternalShallowDataShape[],
    barCount: number,
    groupIndex?: number
  ) {
    return (
      <PoseGroup animateOnMount={this.props.animated}>
        {data.map((barData, barIndex) =>
          this.renderBar(barData, barIndex, barCount, groupIndex)
        )}
      </PoseGroup>
    );
  }

  render() {
    const { data, type } = this.props;
    const isMulti =
      type === 'grouped' ||
      type === 'stacked' ||
      type === 'marimekko' ||
      type === 'stackedNormalized';

    return (
      <Fragment>
        {isMulti &&
          (data as ChartInternalNestedDataShape[]).map((groupData, index) => (
            <g
              transform={this.getTransform(groupData)}
              key={`bar-group-${index}`}
            >
              {this.renderBarGroup(
                groupData.data as ChartInternalShallowDataShape[],
                data.length,
                index
              )}
            </g>
          ))}
        {!isMulti &&
          this.renderBarGroup(
            data as ChartInternalShallowDataShape[],
            data.length
          )}
      </Fragment>
    );
  }
}
