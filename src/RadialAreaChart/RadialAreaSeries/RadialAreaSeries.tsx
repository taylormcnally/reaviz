import React, { Component } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { sequentialScheme, getColor } from '../../common/utils/color';
import { CloneElement } from '../../common/utils/children';
import { PoseSVGGElement } from '../../common/utils/animations';
import { PoseGroup } from 'react-pose';
import { RadialAreaProps, RadialArea } from './RadialArea';

export interface RadialAreaSeriesProps {
  data: ChartInternalShallowDataShape[];
  colorScheme: ((data, index: number) => string) | string[];
  innerRadius: number;
  xScale: any;
  yScale: any;
  id: string;
  area: JSX.Element;
  animated: boolean;
}

export class RadialAreaSeries extends Component<RadialAreaSeriesProps> {
  static defaultProps: Partial<RadialAreaSeriesProps> = {
    colorScheme: [...sequentialScheme],
    area: <RadialArea />,
    animated: true
  };

  getColor(point: ChartInternalShallowDataShape, index: number) {
    const { colorScheme, data } = this.props;

    return Array.isArray(colorScheme)
      ? getColor(colorScheme, data)(index as any)
      : colorScheme(point, index);
  }

  renderArea() {
    const { area, id, xScale, yScale, data, animated, innerRadius } = this.props;

    return (
      <PoseSVGGElement key={1}>
        <CloneElement<RadialAreaProps>
          element={area}
          id={`${id}-rarea-0`}
          xScale={xScale}
          yScale={yScale}
          animated={animated}
          color={this.getColor.bind(this)}
          data={data}
          innerRadius={innerRadius}
        />
      </PoseSVGGElement>
    );
  }

  render() {
    const { data, animated } = this.props;

    return (
      <PoseGroup animateOnMount={animated}>
        {this.renderArea()}
      </PoseGroup>
    );
  }
}
