import React, { Component } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { sequentialScheme, getColor } from '../../common/utils/color';
import { RadialScatterPoint, RadialScatterPointProps } from './RadialScatterPoint';
import { CloneElement } from '../../common/utils/children';
import { PoseSVGGElement } from '../../common/utils/animations';
import { PoseGroup } from 'react-pose';

export interface RadialScatterSeriesProps {
  data: ChartInternalShallowDataShape[];
  colorScheme: ((data, index: number) => string) | string[];
  xScale: any;
  yScale: any;
  id: string;
  point: JSX.Element;
  animated: boolean;
}

export class RadialScatterSeries extends Component<RadialScatterSeriesProps> {
  static defaultProps: Partial<RadialScatterSeriesProps> = {
    colorScheme: [...sequentialScheme],
    point: <RadialScatterPoint />,
    animated: true
  };

  getColor(point: ChartInternalShallowDataShape, index: number) {
    const { colorScheme, data } = this.props;

    return Array.isArray(colorScheme)
      ? getColor(colorScheme, data)(index as any)
      : colorScheme(point, index);
  }

  renderPoint(data: ChartInternalShallowDataShape, index: number) {
    const { point, xScale, yScale, animated } = this.props;

    let dataId;
    if (data.id) {
      dataId = data.id;
    } else {
      console.warn(
        `No 'id' property provided for scatter point; provide one via 'id'.`
      );
    }

    const key = dataId || index;

    return (
      <PoseSVGGElement key={key}>
        <CloneElement<RadialScatterPointProps>
          element={point}
          data={data}
          index={index}
          xScale={xScale}
          yScale={yScale}
          animated={animated}
          color={this.getColor.bind(this)}
        />
      </PoseSVGGElement>
    );
  }

  render() {
    const { data, animated } = this.props;

    return (
      <PoseGroup animateOnMount={animated}>
        {data.map((d, i) => this.renderPoint(d, i))}
      </PoseGroup>
    );
  }
}
