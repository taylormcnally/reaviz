import React, { Component, Fragment, ReactNode, createRef } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import bind from 'memoize-bind';
import { ChartTooltip, ChartTooltipProps } from '../../common/Tooltip';
import { PosedCircle } from './PosedCircle';
import { PosedGroupTransform } from '../../common/utils/animations';
import classNames from 'classnames';
import * as css from './ScatterPoint.module.scss';
import { CloneElement } from '../../common/utils/children';
import {
  constructFunctionProps,
  PropFunctionTypes
} from '../../common/utils/functions';

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

  getCircleEnter() {
    const { xScale, data } = this.props;

    return {
      cy: this.getYPosition(),
      cx: xScale(data.x)
    };
  }

  getCircleExit() {
    const { xScale, data, yScale } = this.props;
    const [yStartDomain] = yScale.domain();
    const yPos = yScale(yStartDomain);

    return {
      cy: yPos,
      cx: xScale(data.x)
    };
  }

  getSymbolEnter() {
    const { data, xScale } = this.props;

    const y = this.getYPosition();
    const x = xScale(data.x);
    const transform = `translate(${x}, ${y})`;

    return {
      transform,
      x,
      y
    };
  }

  getSymbolExit() {
    const { data, xScale, yScale } = this.props;

    const x = xScale(data.x);
    const [yStartDomain] = yScale.domain();
    const yPos = yScale(yStartDomain);

    const transform = `translate(${x}, ${yPos})`;

    return {
      transform
    };
  }

  renderCircle() {
    const {
      data,
      animated,
      index,
      size,
      color,
      cursor,
      className
    } = this.props;
    const fill = typeof color === 'function' ? color(data, index) : color;
    const sizeVal = typeof size === 'function' ? size(data) : size;
    const enterProps = this.getCircleEnter();
    const exitProps = this.getCircleExit();
    const extras = constructFunctionProps(this.props, data);

    return (
      <PosedCircle
        {...extras}
        pose="enter"
        poseKey={`${enterProps.cy}-${enterProps.cx}`}
        enterProps={enterProps}
        exitProps={exitProps}
        r={sizeVal}
        index={index}
        animated={animated}
        cursor={cursor}
        fill={fill}
        className={className}
      />
    );
  }

  renderSymbol() {
    const { data, animated, index, symbol } = this.props;
    const enterProps = this.getSymbolEnter();
    const exitProps = this.getSymbolExit();
    const renderedSymbol = symbol(data);
    const extras = constructFunctionProps(this.props, data);

    return (
      <PosedGroupTransform
        {...extras}
        pose="enter"
        poseKey={`${enterProps.y}-${enterProps.x}`}
        enterProps={enterProps}
        exitProps={exitProps}
        animated={animated}
        index={index}
      >
        {renderedSymbol}
      </PosedGroupTransform>
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
