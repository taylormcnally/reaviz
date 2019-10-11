import React, { Fragment, Component, ReactElement } from 'react';
import { TooltipAreaEvent } from './TooltipAreaEvent';
import { Placement } from 'rdk';
import {
  ChartDataTypes,
  ChartInternalDataShape,
  ChartInternalShallowDataShape,
  ChartInternalNestedDataShape
} from '../data';
import { getPositionForTarget, getClosestPoint } from '../utils/position';
import bind from 'memoize-bind';
import { CloneElement } from '../utils/children';
import { ChartTooltip, ChartTooltipProps } from './ChartTooltip';
import { arc } from 'd3-shape';
import isEqual from 'is-equal';

export interface TooltipAreaProps {
  placement: Placement;
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
  tooltip: ReactElement<ChartTooltipProps, typeof ChartTooltip>;
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

export class TooltipArea extends Component<TooltipAreaProps, TooltipAreaState> {
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

    // If the shape is radial, we need to convert the X coords to a radial format.
    if (isRadial) {
      const outerRadius = Math.min(width, height) / 2;
      let rad = Math.atan2(y - outerRadius, x - outerRadius) + Math.PI / 2;

      // TODO: Figure out what the 'correct' way to do this is...
      if (rad < 0) {
        rad += Math.PI * 2;
      }

      return rad;
    }

    return x;
  }

  onMouseMove(event: React.MouseEvent) {
    const {
      xScale,
      yScale,
      onValueEnter,
      height,
      width,
      isRadial
    } = this.props;
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
        // If its radial, we need to convert the coords to radial format
        const outerRadius = Math.min(width, height) / 2;
        offsetX = pointY * Math.cos(pointX - Math.PI / 2) + outerRadius;
        offsetY = pointY * Math.sin(pointX - Math.PI / 2) + outerRadius;
      } else {
        offsetX = pointX;
        offsetY = pointY;
      }

      offsetX += left + marginX;
      offsetY += top + marginY;

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
      const seriesPoint = point as ChartInternalNestedDataShape;
      if (Array.isArray(seriesPoint.data)) {
        for (const nestedPoint of seriesPoint.data) {
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
    const { height, width } = this.props;

    const innerRadius = this.props.innerRadius || 0;
    const outerRadius = Math.min(width, height) / 2;

    const d = arc()({
      innerRadius,
      outerRadius,
      startAngle: 180,
      endAngle: Math.PI / 2
    });

    return (
      <path
        d={d!}
        opacity="0"
        cursor="auto"
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
    );
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
