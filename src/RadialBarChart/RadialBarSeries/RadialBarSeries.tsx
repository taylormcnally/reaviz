import React, { Component } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { RadialBar, RadialBarProps } from './RadialBar';
import { sequentialScheme, getColor } from '../../common/utils/color';
import { CloneElement } from '../../common/utils/children';
import { PoseSVGGElement } from '../../common/utils/animations';
import { PoseGroup } from 'react-pose';

export interface RadialBarSeriesProps {
  data: ChartInternalShallowDataShape[];
  colorScheme: ((data, index: number) => string) | string[];
  innerRadius: number;
  xScale: any;
  yScale: any;
  id: string;
  bar: JSX.Element;
  animated: boolean;
}

export class RadialBarSeries extends Component<RadialBarSeriesProps> {
  static defaultProps: Partial<RadialBarSeriesProps> = {
    colorScheme: [...sequentialScheme],
    bar: <RadialBar />,
    animated: true
  };

  getColor(point: ChartInternalShallowDataShape, index: number) {
    const { colorScheme, data } = this.props;
    const key = point.key;

    return Array.isArray(colorScheme)
      ? getColor(colorScheme, data)(key!.toString())
      : colorScheme(point, index);
  }

  renderBar(point: ChartInternalShallowDataShape, index: number) {
    const { innerRadius, xScale, yScale, bar, id, data, animated } = this.props;

    return (
      <PoseSVGGElement key={index}>
        <CloneElement<RadialBarProps>
          element={bar}
          id={`radialbar-${id}-${index}`}
          index={index}
          data={point}
          xScale={xScale}
          yScale={yScale}
          innerRadius={innerRadius}
          color={this.getColor.bind(this)}
          barCount={data.length}
          animated={animated}
        />
      </PoseSVGGElement>
    );
  }

  render() {
    const { data, animated } = this.props;

    return (
      <PoseGroup animateOnMount={animated}>
        {data.map((d, i) => this.renderBar(d, i))}
      </PoseGroup>
    );
  }
}
