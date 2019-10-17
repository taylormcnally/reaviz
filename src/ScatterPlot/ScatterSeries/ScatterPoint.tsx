import React, {
  Component,
  Fragment,
  ReactNode,
  createRef,
  ReactElement
} from 'react';
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
import { schemes, getColor, ColorSchemeType } from '../../common/color';

export type ScatterPointProps = {
  /**
   * Whether the element is active or not. Set internally by `ScatterSeries`.
   */
  active?: boolean;

  /**
   * Size of the circle element.
   */
  size?: ((data: ChartInternalShallowDataShape) => number) | number;

  /**
   * Color of the circle.
   */
  color: ColorSchemeType;

  /**
   * Cursor for the element.
   */
  cursor?: string;

  /**
   * D3 scale for X Axis. Set internally by `ScatterPlot`.
   */
  xScale: any;

  /**
   * D3 scale for Y Axis. Set internally by `ScatterPlot`.
   */
  yScale: any;

  /**
   * Height of the chart. Set internally by `ScatterPlot`.
   */
  height: number;

  /**
   * Whether to animation the enter/update/exit. Set internally by `ScatterSeries`.
   */
  animated: boolean;

  /**
   * Index of the element in the series. Set internally by `ScatterSeries`.
   */
  index: number;

  /**
   * Tooltip element.
   */
  tooltip: ReactElement<ChartTooltipProps, typeof ChartTooltip> | null;

  /**
   * Parsed data shape. Set internally by `ScatterPlot`.
   */
  data: ChartInternalShallowDataShape;

  /**
   * Id set internally by `ScatterPlot`.
   */
  id: string;

  /**
   * Symbol element to render.
   */
  symbol: (data: ChartInternalShallowDataShape) => ReactNode;

  /**
   * Whether the elment is visiblbe or not.
   */
  visible?: (data: ChartInternalShallowDataShape, index: number) => boolean;

  /**
   * Event for when a symbol is clicked.
   */
  onClick: (data: ChartInternalShallowDataShape) => void;

  /**
   * Event for when the symbol has mouse enter.
   */
  onMouseEnter: (data: ChartInternalShallowDataShape) => void;

  /**
   * Event for when the symbol has mouse leave.
   */
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
    color: schemes.cybertron[0],
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
    const { data, index, size, color, cursor, id } = this.props;
    const fill = getColor({
      colorScheme: color,
      index,
      point: data
    });

    const r = typeof size === 'function' ? size(data) : size;
    const enter = this.getEnter();
    const exit = this.getExit();
    const extras = constructFunctionProps(this.props, data);
    const transition = this.getTransition();
    const initial = {
      cx: exit.x,
      cy: exit.y,
      fill,
      r,
      opacity: 0
    };

    return (
      <motion.circle
        key={`symbol-${id}-${data.id!}`}
        className={extras.className}
        style={{ ...extras.style, cursor }}
        initial={initial}
        animate={{
          cx: enter.x,
          cy: enter.y,
          opacity: 1,
          fill,
          r
        }}
        exit={initial}
        transition={transition}
      />
    );
  }

  renderSymbol() {
    const { data, symbol, id } = this.props;
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
        key={`symbol-${id}-${data.id!}`}
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
