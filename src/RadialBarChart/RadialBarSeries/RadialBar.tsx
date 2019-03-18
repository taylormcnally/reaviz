import React, { Component, Fragment, createRef } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { arc } from 'd3-shape';
import { Gradient } from '../../common/Styles';
import * as bind from 'memoize-bind';
import { PosedRadialBar } from './PosedRadialBar';
import chroma from 'chroma-js';
import { CloneElement } from '../../common/utils/children';
import { ChartTooltipProps, ChartTooltip } from '../../common/TooltipArea';

export interface RadialBarProps {
  data: ChartInternalShallowDataShape;
  innerRadius: number;
  index: number;
  animated: boolean;
  xScale: any;
  yScale: any;
  color: any;
  gradient: boolean;
  id: string;
  barCount: number;
  className?: any;
  tooltip: JSX.Element;
  onClick: (event) => void;
  onMouseEnter: (event) => void;
  onMouseLeave: (event) => void;
}

interface RadialBarState {
  active?: boolean;
}

export class RadialBar extends Component<RadialBarProps, RadialBarState> {
  static defaultProps: Partial<RadialBarProps> = {
    gradient: true,
    tooltip: <ChartTooltip />,
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined
  };

  state: RadialBarState = {};
  ref = createRef<SVGPathElement>();

  getFill(color: string) {
    const { id, gradient } = this.props;

    if (!gradient) {
      return color;
    }

    return `url(#${id}-gradient)`;
  }

  onMouseEnter(event: MouseEvent) {
    this.setState({ active: true });

    const { onMouseEnter, data } = this.props;
    onMouseEnter({
      value: data,
      nativeEvent: event
    });
  }

  onMouseLeave(event: MouseEvent) {
    this.setState({ active: false });

    const { onMouseLeave, data } = this.props;
    onMouseLeave({
      value: data,
      nativeEvent: event
    });
  }

  onMouseClick(event: MouseEvent) {
    const { onClick, data } = this.props;

    onClick({
      value: data,
      nativeEvent: event
    });
  }

  getArc(data: ChartInternalShallowDataShape) {
    const { innerRadius, xScale, yScale } = this.props;

    const outerRadius = yScale(data.y);
    const startAngle = xScale(data.x);
    const endAngle = xScale(data.x) + xScale.bandwidth();

    const arcFn = arc()
      .innerRadius(innerRadius)
      .outerRadius(() => outerRadius)
      .startAngle(() => startAngle)
      .endAngle(() => endAngle)
      .padAngle(0.01)
      .padRadius(innerRadius);

    return arcFn(data as any);
  }

  renderBar(color: string) {
    const { className, data, animated, barCount, index } = this.props;

    const fill = this.getFill(color);
    const enterProps = {
      d: this.getArc(data)
    };
    const exitProps = {
      // Setting y to 0 causes it to freak...
      d: this.getArc({ ...data, y: .1 })
    };

    return (
      <PosedRadialBar
        pose="enter"
        poseKey={`${data.x}-${data.y}`}
        ref={this.ref}
        animated={animated}
        enterProps={enterProps}
        exitProps={exitProps}
        barCount={barCount}
        index={index}
        fill={fill}
        className={className}
        onMouseEnter={bind(this.onMouseEnter, this)}
        onMouseLeave={bind(this.onMouseLeave, this)}
        onClick={bind(this.onMouseClick, this)}
      />
    );
  }

  render() {
    const { data, index, color, gradient, id, tooltip } = this.props;
    const { active } = this.state;

    const fill = color(data, index);
    const currentColorShade = active ? chroma(fill).brighten(0.5) : fill;

    return (
      <Fragment>
        {this.renderBar(currentColorShade)}
        {!tooltip.props.disabled && (
          <CloneElement<ChartTooltipProps>
            element={tooltip}
            visible={!!active}
            reference={this.ref}
            color={color}
            value={data}
            metadata={data}
          />
        )}
        {gradient && (
          <Gradient
            id={`${id}-gradient`}
            color={currentColorShade}
          />
        )}
      </Fragment>
    );
  }
}
