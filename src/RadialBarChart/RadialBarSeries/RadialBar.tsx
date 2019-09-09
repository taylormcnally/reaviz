import React, { Component, Fragment, createRef } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { arc } from 'd3-shape';
import { Gradient } from '../../common/gradients';
import bind from 'memoize-bind';
import { PosedRadialBar } from './PosedRadialBar';
import chroma from 'chroma-js';
import { CloneElement } from '../../common/utils/children';
import { ChartTooltipProps, ChartTooltip } from '../../common/Tooltip';
import { path } from 'd3-path';

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
  curved: boolean;
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
    curved: false,
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined
  };

  state: RadialBarState = {};
  ref = createRef<SVGPathElement>();
  previousEnter: any;

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
    const { innerRadius, xScale, yScale, curved } = this.props;

    const outerRadius = yScale(data.y);

    if (curved) {
      const startAngle = xScale(data.x);
      const endAngle = startAngle + xScale.bandwidth();

      const arcFn = arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle)
        .padAngle(0.01)
        .padRadius(innerRadius);

      return arcFn(data as any);
    } else {
      const startAngle = xScale(data.x) - Math.PI * 0.5;
      const endAngle = startAngle + xScale.bandwidth();

      const innerAngleDistance = endAngle - startAngle;
      const arcLength = innerRadius * innerAngleDistance;
      const outerAngleDistance = arcLength / outerRadius;
      const halfAngleDistanceDelta =
        (innerAngleDistance - outerAngleDistance) / 2;

      const pathFn = path();
      pathFn.arc(0, 0, innerRadius, startAngle, endAngle);
      pathFn.arc(
        0,
        0,
        outerRadius,
        endAngle - halfAngleDistanceDelta,
        startAngle + halfAngleDistanceDelta,
        true
      );

      return pathFn.toString();
    }
  }

  renderBar(color: string) {
    const { className, data, animated, barCount, index, yScale } = this.props;

    const fill = this.getFill(color);

    // Track previous props
    const previousEnter = this.previousEnter
      ? { ...this.previousEnter }
      : undefined;
    this.previousEnter = { ...data };

    const [yStart] = yScale.domain();
    const exitProps = {
      ...data,
      y: yStart
    };

    return (
      <PosedRadialBar
        pose="enter"
        poseKey={`${data.x}-${data.y}-${index}`}
        ref={this.ref}
        animated={animated}
        enterProps={data}
        previousEnter={previousEnter}
        exitProps={exitProps}
        getArc={this.getArc.bind(this)}
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
          />
        )}
        {gradient && (
          <Gradient id={`${id}-gradient`} color={currentColorShade} />
        )}
      </Fragment>
    );
  }
}
