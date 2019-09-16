import React, { Component, ReactNode, createRef, Fragment } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { radialLine } from 'd3-shape';
import { PosedGroupTransform } from '../../common/utils/animations';
import bind from 'memoize-bind';
import classNames from 'classnames';
import { ChartTooltip, ChartTooltipProps } from '../../common/Tooltip';
import { CloneElement } from '../../common/utils/children';
import * as css from './RadialScatterPoint.module.scss';

export interface RadialScatterPointProps {
  data: ChartInternalShallowDataShape;
  index: number;
  animated: boolean;
  xScale: any;
  yScale: any;
  fill: string;
  id: string;
  color: any;
  className?: any;
  active?: boolean;
  visible?: (value, index) => boolean;
  symbol: (value) => ReactNode;
  size?: ((d) => number) | number;
  tooltip: JSX.Element | null;
  onClick: (event) => void;
  onMouseEnter: (event) => void;
  onMouseLeave: (event) => void;
}

interface RadialScatterPointState {
  hovered: boolean;
}

export class RadialScatterPoint extends Component<
  RadialScatterPointProps,
  RadialScatterPointState
> {
  static defaultProps: Partial<RadialScatterPointProps> = {
    size: 3,
    color: 'rgba(174, 52, 255, .5)',
    tooltip: <ChartTooltip />,
    active: true,
    onClick: () => undefined,
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined
  };

  ref = createRef<SVGGElement>();
  state: RadialScatterPointState = {
    hovered: false
  };

  onMouseEnter(event: MouseEvent) {
    this.setState({ hovered: true });

    const { onMouseEnter, data } = this.props;
    onMouseEnter({
      value: data,
      nativeEvent: event
    });
  }

  onMouseLeave(event: MouseEvent) {
    this.setState({ hovered: false });

    const { onMouseLeave, data } = this.props;
    onMouseLeave({
      value: data,
      nativeEvent: event
    });
  }

  onClick(event: MouseEvent) {
    const { onClick, data } = this.props;
    onClick({
      value: data,
      nativeEvent: event
    });
  }

  getTranslate(data: ChartInternalShallowDataShape) {
    const { xScale, yScale } = this.props;

    const fn = radialLine()
      .radius((d: any) => yScale(d.y))
      .angle((d: any) => xScale(d.x));

    // Parse the generated path to get point coordinates
    // Ref: https://bit.ly/2CnZcPl
    const path = fn([data] as any);

    let transform;
    if (path) {
      const coords = path.slice(1).slice(0, -1);
      transform = `translate(${coords})`;
    }

    return transform;
  }

  render() {
    const {
      size,
      data,
      color,
      index,
      animated,
      symbol,
      active,
      tooltip,
      yScale,
      className
    } = this.props;
    const { hovered } = this.state;

    const fill = typeof color === 'function' ? color(data, index) : color;
    const transform = this.getTranslate(data);
    const sizeVal = typeof size === 'function' ? size(data) : size;

    const [yStart] = yScale.domain();
    const exitTransform = this.getTranslate({ ...data, y: yStart });

    return (
      <Fragment>
        <PosedGroupTransform
          pose="enter"
          poseKey={transform}
          enterProps={{ transform }}
          exitProps={{ transform: exitTransform }}
          index={index}
          animated={animated}
          ref={this.ref}
          onMouseEnter={bind(this.onMouseEnter, this)}
          onMouseLeave={bind(this.onMouseLeave, this)}
          onClick={bind(this.onClick, this)}
          className={classNames(className, {
            [css.inactive]: !active
          })}
        >
          {symbol && symbol(data)}
          {!symbol && <circle r={sizeVal} fill={fill} />}
        </PosedGroupTransform>
        {tooltip && (
          <CloneElement<ChartTooltipProps>
            element={tooltip}
            visible={hovered}
            reference={this.ref}
            value={data}
          />
        )}
      </Fragment>
    );
  }
}
