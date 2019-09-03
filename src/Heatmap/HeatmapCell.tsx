import React, { Component, Fragment, createRef } from 'react';
import { ChartTooltip, ChartTooltipProps } from '../common/TooltipArea';
import { CloneElement } from '../common/utils/children';
import bind from 'memoize-bind';
import { PosedCell } from './PosedCell';

export interface HeatmapCellProps {
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
  onClick: (event) => void;
  onMouseEnter: (event) => void;
  onMouseLeave: (event) => void;
}

interface HeatmapCellState {
  active?: boolean;
}

export class HeatmapCell extends Component<HeatmapCellProps, HeatmapCellState> {
  static defaultProps: Partial<HeatmapCellProps> = {
    rx: 2,
    ry: 2,
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
      x: `${data.key} ∙ ${data.x}`
    };
  }

  render() {
    const {
      tooltip,
      onMouseEnter,
      onMouseLeave,
      onClick,
      cellIndex,
      ...rest
    } = this.props;
    const { active } = this.state;

    return (
      <Fragment>
        <PosedCell
          {...rest}
          ref={this.rect}
          index={cellIndex}
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
