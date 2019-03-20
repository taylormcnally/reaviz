import React, { Component, Fragment, createRef } from 'react';
import classNames from 'classnames';
import posed from 'react-pose';
import { ChartInternalDataTypes } from '../../common/data';
import { CloneElement } from '../../common/utils/children';
import { formatValue } from '../../common/utils/formatting';
import { Tooltip, TooltipProps } from '../../common/TooltipArea';
import { SankeyLabel, SankeyLabelProps } from '../SankeyLabel';
import { Node, DEFAULT_COLOR } from '../utils';
import bind from 'memoize-bind';
import * as css from './SankeyNode.module.scss';
import { transition } from '../../common/utils/animations';

export const PosedNode = posed.rect({
  enter: {
    opacity: 1,
    transition: {
      ...transition,
      opacity: {
        type: 'tween',
        ease: 'linear',
        duration: 150
      }
    }
  },
  exit: {
    opacity: 0
  }
});

export interface SankeyNodeProps extends Node {
  active: boolean;
  animated: boolean;
  chartWidth?: number;
  className?: string;
  disabled: boolean;
  label: JSX.Element;
  showLabel: boolean;
  style?: object;
  tooltip: JSX.Element;
  width?: number;
  onClick: (event: React.MouseEvent<SVGRectElement>) => void;
  onMouseEnter: (event: React.MouseEvent<SVGRectElement>) => void;
  onMouseLeave: (event: React.MouseEvent<SVGRectElement>) => void;
}

interface SankeyNodeState {
  hovered?: boolean;
}

// Set padding modifier for the tooltips
export const modifiers = {
  offset: {
    offset: '0, 5px'
  }
};

export class SankeyNode extends Component<SankeyNodeProps, SankeyNodeState> {
  static defaultProps: Partial<SankeyNodeProps> = {
    active: false,
    animated: true,
    color: DEFAULT_COLOR,
    disabled: false,
    label: <SankeyLabel />,
    showLabel: true,
    tooltip: <Tooltip followCursor={true} modifiers={modifiers} />,
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined
  };

  state: SankeyNodeState = {};
  rect = createRef<SVGRectElement>();

  getNode() {
    const {
      id,
      title,
      color,
      sourceLinks,
      targetLinks,
      value,
      index,
      x0,
      x1,
      y0,
      y1
    } = this.props;

    return {
      id,
      title,
      color,
      sourceLinks,
      targetLinks,
      value,
      index,
      x0,
      x1,
      y0,
      y1
    };
  }

  onMouseEnter(event: React.MouseEvent<SVGRectElement>) {
    this.setState({ hovered: true });
    this.props.onMouseEnter(event);
  }

  onMouseLeave(event: React.MouseEvent<SVGRectElement>) {
    this.setState({ hovered: false });
    this.props.onMouseLeave(event);
  }

  renderNode() {
    const {
      animated,
      disabled,
      className,
      style,
      color,
      width,
      index,
      x0,
      x1,
      y0,
      y1,
      onClick
    } = this.props;
    const nodeWidth = width || (x1 && x0 && x1 - x0 > 0 ? x1 - x0 : 0);
    const nodeHeight = y1 && y0 && y1 - y0 > 0 ? y1 - y0 : 0;

    return (
      <PosedNode
        pose="enter"
        poseKey={`sankey-node-${x0}-${x1}-${y0}-${y1}-${index}`}
        animated={animated}
        className={classNames(css.node, {
          [css.disabled]: disabled
        }, className)}
        style={style}
        ref={this.rect}
        x={x0}
        y={y0}
        width={nodeWidth}
        height={nodeHeight}
        fill={color}
        onClick={onClick}
        onMouseEnter={bind(this.onMouseEnter, this)}
        onMouseLeave={bind(this.onMouseLeave, this)}
      />
    );
  }

  renderTooltipContent() {
    const { title, value } = this.props;

    return (
      <div className={css.tooltip}>
        <div className={css.tooltipLabel}>{title}</div>
        <div className={css.tooltipValue}>
          {formatValue(value as ChartInternalDataTypes)}
        </div>
      </div>
    );
  }

  render() {
    const { active, chartWidth, label, tooltip, showLabel } = this.props;

    return (
      <Fragment>
        {this.renderNode()}
        {showLabel && (
          <CloneElement<SankeyLabelProps>
            active={active}
            element={label}
            chartWidth={chartWidth}
            node={this.getNode()}
          />
        )}
        {!tooltip.props.disabled && (
          <CloneElement<TooltipProps>
            content={this.renderTooltipContent.bind(this)}
            element={tooltip}
            visible={this.state.hovered}
            reference={this.rect}
          />
        )}
      </Fragment>
    );
  }
}
