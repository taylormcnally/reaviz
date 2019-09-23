import React, { Component } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { sequentialScheme, getColor } from '../../common/utils/color';
import { CloneElement } from '../../common/utils/children';
import { RadialAreaProps, RadialArea } from './RadialArea';
import { RadialLine, RadialLineProps } from './RadialLine';
import { RadialInterpolationTypes } from '../../common/utils/interpolation';
import { RadialPointSeries, RadialPointSeriesProps } from './RadialPointSeries';
import {
  TooltipAreaProps,
  TooltipArea,
  TooltipAreaEvent
} from '../../common/Tooltip';
import bind from 'memoize-bind';

export interface RadialAreaSeriesProps {
  data: ChartInternalShallowDataShape[];
  colorScheme: ((data, index: number) => string) | string[];
  outerRadius: number;
  innerRadius: number;
  xScale: any;
  yScale: any;
  id: string;
  interpolation: RadialInterpolationTypes;
  animated: boolean;
  height: number;
  width: number;
  area: JSX.Element | null;
  line: JSX.Element | null;
  symbols: JSX.Element | null;
  tooltip: JSX.Element;
}

interface RadialAreaSeriesState {
  activeValues?: any;
  activePoint?: number;
}

export class RadialAreaSeries extends Component<
  RadialAreaSeriesProps,
  RadialAreaSeriesState
> {
  static defaultProps: Partial<RadialAreaSeriesProps> = {
    colorScheme: [...sequentialScheme],
    interpolation: 'smooth',
    animated: true,
    area: <RadialArea />,
    line: <RadialLine />,
    symbols: <RadialPointSeries />,
    tooltip: <TooltipArea />
  };

  state: RadialAreaSeriesState = {};

  getColor(point: ChartInternalShallowDataShape, index: number) {
    const { colorScheme, data } = this.props;

    return Array.isArray(colorScheme)
      ? getColor(colorScheme, data)(index as any)
      : colorScheme(point, index);
  }

  onValueEnter(event: TooltipAreaEvent) {
    this.setState({
      activePoint: event.pointX,
      activeValues: event.value
    });
  }

  onValueLeave() {
    this.setState({
      activePoint: undefined,
      activeValues: undefined
    });
  }

  renderArea() {
    const {
      area,
      id,
      xScale,
      yScale,
      data,
      interpolation,
      animated,
      innerRadius,
      outerRadius
    } = this.props;

    return (
      <CloneElement<RadialAreaProps>
        element={area}
        id={`${id}-radial-area`}
        xScale={xScale}
        yScale={yScale}
        animated={animated}
        color={this.getColor.bind(this)}
        data={data}
        interpolation={interpolation}
        outerRadius={outerRadius}
        innerRadius={innerRadius}
      />
    );
  }

  renderLine() {
    const { line, xScale, yScale, data, animated, interpolation } = this.props;

    return (
      <CloneElement<RadialLineProps>
        element={line}
        xScale={xScale}
        yScale={yScale}
        animated={animated}
        interpolation={interpolation}
        color={this.getColor.bind(this)}
        data={data}
      />
    );
  }

  renderSymbols() {
    const { xScale, yScale, animated, area, symbols, data } = this.props;
    const { activeValues } = this.state;

    // Animations are only valid for Area
    const activeSymbols =
      (symbols && symbols.props.activeValues) || activeValues;
    const isAnimated = area !== undefined && animated && !activeSymbols;

    return (
      <CloneElement<RadialPointSeriesProps>
        element={symbols}
        activeValues={activeValues}
        xScale={xScale}
        yScale={yScale}
        data={data}
        animated={isAnimated}
        color={this.getColor.bind(this)}
      />
    );
  }

  render() {
    const {
      area,
      line,
      symbols,
      tooltip,
      xScale,
      yScale,
      data,
      id,
      width,
      height,
      innerRadius
    } = this.props;

    return (
      <CloneElement<TooltipAreaProps>
        element={tooltip}
        xScale={xScale}
        yScale={yScale}
        data={data}
        height={height}
        width={width}
        isRadial={true}
        innerRadius={innerRadius}
        color={this.getColor.bind(this)}
        onValueEnter={bind(this.onValueEnter, this)}
        onValueLeave={bind(this.onValueLeave, this)}
      >
        <g clipPath={`url(#${id}-path)`}>
          {area && this.renderArea()}
          {line && this.renderLine()}
          {symbols && this.renderSymbols()}
        </g>
      </CloneElement>
    );
  }
}
