import React, { Fragment } from 'react';
import { TooltipAreaEvent } from './TooltipAreaEvent';
import { Placement } from 'rdk';
import {
  ChartDataTypes,
  ChartInternalDataShape,
  ChartInternalShallowDataShape,
  isNested
} from '../data';
import { getPositionForTarget, getClosestPoint } from '../utils/position';
import bind from 'memoize-bind';
import { isEqual } from 'lodash-es';
import { CloneElement } from '../utils/children';
import { ChartTooltip, ChartTooltipProps } from './ChartTooltip';
import { arc } from 'd3-shape';

export interface TooltipAreaProps {
  placement: Placement;
  formatter?: (value: any, color?: any) => any;
  height: number;
  width: number;
  xScale: any;
  yScale: any;
  disabled: boolean;
  color: any;
  data: ChartInternalDataShape[];
  children?: any;
  isRadial?: boolean;
  innerRadius?: number;
  tooltip: JSX.Element;
  onValueEnter: (event: TooltipAreaEvent) => void;
  onValueLeave: () => void;
}

interface TooltipAreaState {
  visible?: boolean;
  placement?: Placement;
  value?: any;
  offsetX?: any;
  offsetY?: any;
  data: Array<TooltipDataShape | ChartInternalShallowDataShape>;
}

interface TooltipDataShape {
  x?: ChartDataTypes;
  y?: ChartDataTypes;
  data?: ChartDataTypes | Array<ChartDataTypes | ChartInternalShallowDataShape>;
}

export class TooltipArea extends React.Component<
  TooltipAreaProps,
  TooltipAreaState
> {
  static defaultProps: Partial<TooltipAreaProps> = {
    placement: 'top',
    isRadial: false,
    tooltip: <ChartTooltip />,
    onValueEnter: () => undefined,
    onValueLeave: () => undefined
  };

  prevX: number | undefined;
  prevY: number | undefined;

  constructor(props: TooltipAreaProps) {
    super(props);
    this.state = {
      data: this.transformData(props.data)
    };
  }

  componentDidUpdate(prevProps: TooltipAreaProps) {
    const { data } = this.props;

    if (data !== prevProps.data) {
      this.setState({
        data: this.transformData(data)
      });
    }
  }

  getXCoord(x: number, y: number) {
    const { isRadial, width, height } = this.props;

    if (isRadial) {
      const outerRadius = Math.min(width, height) / 2;
      let rad = Math.atan2(y - outerRadius, x - outerRadius) + Math.PI / 2;

      if (rad < 0) {
        rad += Math.PI * 2;
      }

      return rad;
    }

    return x;
  }

  onMouseMove(event: React.MouseEvent) {
    const { xScale, yScale, onValueEnter, height, width, isRadial } = this.props;
    let placement = this.props.placement;
    const { value, data } = this.state;

    const { x, y } = getPositionForTarget(event);
    const xCoord = this.getXCoord(x, y);
    const newValue = getClosestPoint(xCoord, xScale, data);

    if (!isEqual(newValue, value)) {
      const pointX = xScale(newValue.x);
      let pointY = yScale(newValue.y);
      let marginX = 0;
      let marginY = 0;

      if (isNaN(pointY)) {
        pointY = height / 2;
        marginX = 10;
        placement = 'right';
      } else {
        marginY = -10;
      }

      // If the points didn't change, don't trigger an update
      if (pointX === this.prevX && pointY === this.prevY) {
        return;
      }

      this.prevY = pointY;
      this.prevX = pointX;

      const target = event.target as SVGRectElement;
      const { top, left } = target.getBoundingClientRect();

      let offsetX = 0;
      let offsetY = 0;

      if (isRadial) {
       const outerRadius = Math.min(width, height) / 2;
       offsetX = pointY * Math.cos(pointX - Math.PI / 2) + left + outerRadius + marginX;
       offsetY = pointY * Math.sin(pointX - Math.PI / 2) + top + outerRadius + marginY;
      } else {
        offsetX = pointX + left + marginX;
        offsetY = pointY + top + marginY;
      }

      this.setState({
        placement,
        visible: true,
        value: newValue,
        offsetX,
        offsetY
      });

      onValueEnter({
        visible: true,
        value: newValue,
        pointY,
        pointX,
        offsetX,
        offsetY,
        nativeEvent: event
      });
    }
  }

  onMouseLeave() {
    this.prevX = undefined;
    this.prevY = undefined;

    this.setState({
      value: undefined,
      visible: false
    });

    this.props.onValueLeave();
  }

  getTooltipReference() {
    const { offsetX, offsetY } = this.state;

    return {
      width: 4,
      height: 4,
      top: offsetY,
      left: offsetX
    };
  }

  transformData(series: ChartInternalDataShape[]) {
    const result: TooltipDataShape[] = [];

    for (const point of series) {
      if (isNested(point)) {
        for (const nestedPoint of point.data) {
          const right = nestedPoint.x;
          let idx = result.findIndex(r => {
            const left = r.x;
            if (left instanceof Date && right instanceof Date) {
              return left.getTime() === right.getTime();
            }
            return left === right;
          });

          if (idx === -1) {
            result.push({
              x: nestedPoint.x,
              data: []
            });

            idx = result.length - 1;
          }

          const data = result[idx].data;

          if (Array.isArray(data)) {
            data.push(nestedPoint);
          }
        }
      } else {
        result.push(point);
      }
    }

    return result;
  }

  renderRadial() {
    const { height, width, data, innerRadius } = this.props;

    const outerRadius = Math.min(width, height);
    const arcFn = arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(Math.PI / 2);
    const d = arcFn(data as any);

    return (
      <path
        d={d}
        opacity={0}
        cursor="auto"
        transform={`translate(-${width / 2}, ${height / 2})`}
        onMouseMove={bind(this.onMouseMove, this)}
      />
    );
  }

  renderLinear() {
    const { height, width } = this.props;

    return (
      <rect
        height={height}
        width={width}
        opacity={0}
        cursor="auto"
        onMouseMove={bind(this.onMouseMove, this)}
      />
    )
  }

  render() {
    const { isRadial, children, tooltip, disabled, color } = this.props;
    const { visible, placement, value } = this.state;

    return (
      <Fragment>
        {disabled && children}
        {!disabled && (
          <g onMouseLeave={bind(this.onMouseLeave, this)}>
            {isRadial && this.renderRadial()}
            {!isRadial && this.renderLinear()}
            <CloneElement<ChartTooltipProps>
              element={tooltip}
              visible={visible}
              placement={placement}
              reference={this.getTooltipReference()}
              color={color}
              value={value}
            />
            {children}
          </g>
        )}
      </Fragment>
    );
  }
}
