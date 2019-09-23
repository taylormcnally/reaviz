import React, { Component, Fragment, createRef } from 'react';
import { ChartTooltip, ChartTooltipProps } from '../../common/Tooltip';
import { CloneElement } from '../../common/utils/children';
import bind from 'memoize-bind';
import {
  constructFunctionProps,
  PropFunctionTypes
} from '../../common/utils/functions';
import chroma from 'chroma-js';
import css from './HeatmapCell.module.scss';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { DEFAULT_TRANSITION } from '../../common/Motion';

export type HeatmapCellProps = {
  x: number;
  y: number;
  rx: number;
  ry: number;
  height: number;
  cellCount: number;
  width: number;
  tooltip: JSX.Element | null;
  fill: string;
  data: any;
  animated: boolean;
  cellIndex: number;
  cursor: string;
  onClick: (event) => void;
  onMouseEnter: (event) => void;
  onMouseLeave: (event) => void;
} & PropFunctionTypes;

interface HeatmapCellState {
  active?: boolean;
}

// Set padding modifier for the tooltips
const modifiers = {
  offset: {
    offset: '0, 3px'
  }
};

export class HeatmapCell extends Component<HeatmapCellProps, HeatmapCellState> {
  static defaultProps: Partial<HeatmapCellProps> = {
    rx: 2,
    ry: 2,
    cursor: 'auto',
    tooltip: <ChartTooltip />,
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined
  };

  state: HeatmapCellState = {};
  rect = createRef<SVGRectElement>();

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

  getTooltipData() {
    const { data } = this.props;

    return {
      y: data.value,
      x: `${data.key} ∙ ${data.x}`,
      data
    };
  }

  getTransition() {
    const { animated, cellIndex, cellCount } = this.props;

    if (animated) {
      return {
        ...DEFAULT_TRANSITION,
        delay: (cellIndex / cellCount) * 0.005
      };
    } else {
      return {
        type: false,
        delay: 0
      };
    }
  }

  render() {
    const {
      tooltip,
      onMouseEnter,
      onMouseLeave,
      onClick,
      cellIndex,
      data,
      cursor,
      fill,
      ...rest
    } = this.props;
    const { active } = this.state;

    const extras = constructFunctionProps(this.props, data);
    const isTransparent = fill === 'transparent';
    const stroke = active && !isTransparent ? chroma(fill).brighten(1) : fill;
    const transition = this.getTransition();

    return (
      <Fragment>
        <g ref={this.rect}>
          <motion.rect
            {...rest}
            fill={fill}
            stroke={stroke}
            style={{ ...extras.style, cursor }}
            className={classNames(css.cell, extras.className)}
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            transition={transition}
            onMouseEnter={bind(this.onMouseEnter, this)}
            onMouseLeave={bind(this.onMouseLeave, this)}
            onClick={bind(this.onMouseClick, this)}
          />
        </g>
        {tooltip && !tooltip.props.disabled && !isTransparent && (
          <CloneElement<ChartTooltipProps>
            element={tooltip}
            visible={!!active}
            modifiers={tooltip.props.modifiers || modifiers}
            reference={this.rect}
            value={this.getTooltipData()}
          />
        )}
      </Fragment>
    );
  }
}
