import React, { Component } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { sequentialScheme, getColor } from '../../common/utils/color';
import { CloneElement } from '../../common/utils/children';
import { PoseSVGGElement } from '../../common/utils/animations';
import { PoseGroup } from 'react-pose';
import { RadialAreaProps, RadialArea } from './RadialArea';
import { RadialLine, RadialLineProps } from './RadialLine';

export interface RadialAreaSeriesProps {
  data: ChartInternalShallowDataShape[];
  colorScheme: ((data, index: number) => string) | string[];
  innerRadius: number;
  xScale: any;
  yScale: any;
  id: string;
  area: JSX.Element | null;
  line: JSX.Element | null;
  animated: boolean;
}

export class RadialAreaSeries extends Component<RadialAreaSeriesProps> {
  static defaultProps: Partial<RadialAreaSeriesProps> = {
    colorScheme: [...sequentialScheme],
    area: <RadialArea />,
    line: <RadialLine />,
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
      <CloneElement<RadialAreaProps>
        element={area}
        id={`${id}-radial-area`}
        xScale={xScale}
        yScale={yScale}
        animated={animated}
        color={this.getColor.bind(this)}
        data={data}
        innerRadius={innerRadius}
      />
    );
  }

  renderLine() {
    const { line, xScale, yScale, data, animated } = this.props;

    return (
      <CloneElement<RadialLineProps>
        element={line}
        xScale={xScale}
        yScale={yScale}
        animated={animated}
        color={this.getColor.bind(this)}
        data={data}
      />
    );
  }

  render() {
    const { area, line, animated } = this.props;

    return (
      <PoseGroup animateOnMount={animated}>
        <PoseSVGGElement key="1">
          {area && this.renderArea()}
          {line && this.renderLine()}
        </PoseSVGGElement>
      </PoseGroup>
    );
  }
}
