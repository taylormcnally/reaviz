import React, { Component, Fragment, createRef } from 'react';
import { ChartTooltip, ChartTooltipProps } from '../../common/Tooltip';
import { CloneElement } from '../../common/utils/children';
import bind from 'memoize-bind';
import { PosedCell } from './PosedCell';
import {
  constructFunctionProps,
  PropFunctionTypes
} from '../../common/utils/functions';
import chroma from 'chroma-js';
import css from './HeatmapCell.module.scss';
import classNames from 'classnames';

export type HeatmapCellProps = {
  x: number;
  y: number;
  rx: number;
  ry: number;
  height: number;
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
    const stroke = active ? chroma(fill).brighten(1) : 'fill';

    return (
      <Fragment>
        <PosedCell
          {...rest}
          fill={fill}
          stroke={stroke}
          ref={this.rect}
          index={cellIndex}
          style={{ ...extras.style, cursor }}
          className={classNames(css.cell, extras.className)}
          onMouseEnter={bind(this.onMouseEnter, this)}
          onMouseLeave={bind(this.onMouseLeave, this)}
          onClick={bind(this.onMouseClick, this)}
        />
        {tooltip && !tooltip.props.disabled && (
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
