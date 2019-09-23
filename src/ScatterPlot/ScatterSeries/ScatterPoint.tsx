import React, { Component, Fragment, ReactNode, createRef } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import bind from 'memoize-bind';
import { ChartTooltip, ChartTooltipProps } from '../../common/Tooltip';
import classNames from 'classnames';
import { CloneElement } from '../../common/utils/children';
import {
  constructFunctionProps,
  PropFunctionTypes
} from '../../common/utils/functions';
import css from './ScatterPoint.module.scss';
import { motion } from 'framer-motion';
import { DEFAULT_TRANSITION } from '../../common/Motion';

export type ScatterPointProps = {
  symbol: (data: ChartInternalShallowDataShape) => ReactNode;
  active?: boolean;
  size?: ((data: ChartInternalShallowDataShape) => number) | number;
  color: any;
  cursor?: string;
  xScale: any;
  yScale: any;
  height: number;
  animated: boolean;
  index: number;
  tooltip: JSX.Element | null;
  data: ChartInternalShallowDataShape;
  visible?: (data: ChartInternalShallowDataShape, index: number) => boolean;
  onClick: (data: ChartInternalShallowDataShape) => void;
  onMouseEnter: (data: ChartInternalShallowDataShape) => void;
  onMouseLeave: (data: ChartInternalShallowDataShape) => void;
} & PropFunctionTypes;

interface ScatterPointState {
  active: boolean;
}

export class ScatterPoint extends Component<
  ScatterPointProps,
  ScatterPointState
> {
  static defaultProps: Partial<ScatterPointProps> = {
    active: true,
    tooltip: <ChartTooltip />,
    cursor: 'pointer',
    size: 4,
    color: '#AE34FF',
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined
  };

  rect = createRef<SVGGElement>();

  state: ScatterPointState = {
    active: false
  };

  onMouseEnter() {
    this.setState({ active: true });
    this.props.onMouseEnter(this.props.data);
  }

  onMouseLeave() {
    this.setState({ active: false });
    this.props.onMouseLeave(this.props.data);
  }

  onClick() {
    this.props.onClick(this.props.data);
  }

  getYPosition() {
    const { yScale, data } = this.props;

    let cy = yScale(data.y1);
    if (yScale.bandwidth) {
      const width = yScale.bandwidth();
      cy = cy + width / 2;
    }

    return cy;
  }

  getEnter() {
    const { xScale, data } = this.props;
    return {
      x: xScale(data.x),
      y: this.getYPosition()
    };
  }

  getExit() {
    const { xScale, data, yScale } = this.props;
    const [yStartDomain] = yScale.domain();

    return {
      y: yScale(yStartDomain),
      x: xScale(data.x)
    };
  }

  getTransition() {
    const { animated, index } = this.props;

    if (animated) {
      return {
        ...DEFAULT_TRANSITION,
        delay: index * 0.005
      };
    } else {
      return {
        type: false,
        delay: 0
      };
    }
  }

  renderCircle() {
    const { data, index, size, color, cursor } = this.props;
    const fill = typeof color === 'function' ? color(data, index) : color;
    const r = typeof size === 'function' ? size(data) : size;
    const enter = this.getEnter();
    const exit = this.getExit();
    const extras = constructFunctionProps(this.props, data);
    const transition = this.getTransition();
    const initial = {
      cx: exit.x,
      cy: exit.y,
      opacity: 0
    };

    return (
      <motion.circle
        className={extras.className}
        style={{ ...extras.style, cursor }}
        initial={initial}
        animate={{
          cx: enter.x,
          cy: enter.y,
          opacity: 1
        }}
        exit={initial}
        fill={fill}
        r={r}
        transition={transition}
      />
    );
  }

  renderSymbol() {
    const { data, symbol } = this.props;
    const enter = this.getEnter();
    const exit = this.getExit();
    const renderedSymbol = symbol(data);
    const extras = constructFunctionProps(this.props, data);
    const transition = this.getTransition();

    const initial = {
      translateX: exit.x,
      translateY: exit.y,
      opacity: 0
    };

    return (
      <motion.g
        {...extras}
        initial={initial}
        animate={{
          translateX: enter.x,
          translateY: enter.y,
          opacity: 1
        }}
        exit={initial}
        transition={transition}
      >
        {renderedSymbol}
      </motion.g>
    );
  }

  render() {
    const { symbol, tooltip, data } = this.props;
    const { active } = this.state;

    return (
      <Fragment>
        <g
          ref={this.rect}
          onMouseEnter={bind(this.onMouseEnter, this)}
          onMouseLeave={bind(this.onMouseLeave, this)}
          onClick={bind(this.onClick, this)}
          className={classNames({
            [css.inactive]: !this.props.active
          })}
        >
          {symbol && this.renderSymbol()}
          {!symbol && this.renderCircle()}
        </g>
        {tooltip && !tooltip.props.disabled && (
          <CloneElement<ChartTooltipProps>
            element={tooltip}
            visible={active}
            reference={this.rect}
            value={data}
          />
        )}
      </Fragment>
    );
  }
}
