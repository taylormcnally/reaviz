import React, { Component, Fragment, createRef } from 'react';
import { ChartTooltip, ChartTooltipProps } from '../common/TooltipArea';
import { CloneElement } from '../common/utils/children';
import bind from 'memoize-bind';
import { PosedCell } from './PosedCell';
import {
  constructFunctionProps,
  PropFunctionTypes
} from '../common/utils/functions';

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
      metadata: data
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
      ...rest
    } = this.props;
    const { active } = this.state;
    const extras = constructFunctionProps(this.props, data);

    return (
      <Fragment>
        <PosedCell
          {...rest}
          ref={this.rect}
          index={cellIndex}
          style={{ ...extras.style, cursor }}
          className={extras.className}
          onMouseEnter={bind(this.onMouseEnter, this)}
          onMouseLeave={bind(this.onMouseLeave, this)}
          onClick={bind(this.onMouseClick, this)}
        />
        {tooltip && !tooltip.props.disabled && (
          <CloneElement<ChartTooltipProps>
            element={tooltip}
            visible={!!active}
            reference={this.rect}
            value={this.getTooltipData()}
          />
        )}
      </Fragment>
    );
  }
}
