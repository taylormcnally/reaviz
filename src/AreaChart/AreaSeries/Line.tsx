import React, { createRef, Fragment, PureComponent } from 'react';
import { line } from 'd3-shape';
import {
  interpolate,
  InterpolationTypes
} from '../../common/utils/interpolation';
import {
  ChartInternalDataShape,
  ChartInternalShallowDataShape
} from '../../common/data';
import { calculateShowStroke } from '../../common/utils/stroke';
import { constructFunctionProps, PropFunctionTypes } from '../../common/utils/functions';
import { PosedLine } from './PosedLine';

export type LineProps = {
  data: ChartInternalDataShape[];
  width: number;
  color: any;
  yScale: any;
  xScale: any;
  index: number;
  strokeWidth: number;
  showZeroStroke: boolean;
  interpolation: InterpolationTypes;
  animated: boolean;
  hasArea: boolean;
} & PropFunctionTypes;

export class Line extends PureComponent<LineProps> {
  static defaultProps: Partial<LineProps> = {
    showZeroStroke: true,
    strokeWidth: 3
  };

  ghostPathRef = createRef<SVGPathElement>();

  getLinePath(data: ChartInternalShallowDataShape[]) {
    const { showZeroStroke, interpolation } = this.props;

    const fn = line()
      .x((d: any) => d.x)
      .y((d: any) => d.y1)
      .defined((d: any) => showZeroStroke || calculateShowStroke(d, data))
      .curve(interpolate(interpolation));

    return fn(data as any);
  }

  getCoords() {
    const { data, xScale, yScale } = this.props;

    return data.map((item: any) => ({
      x: xScale(item.x),
      x1: xScale(item.x) - xScale(item.x1),
      y: yScale(item.y),
      y0: yScale(item.y0),
      y1: yScale(item.y1)
    })) as ChartInternalShallowDataShape[];
  }

  getLineEnter(coords: ChartInternalShallowDataShape[]) {
    const linePath = this.getLinePath(coords);

    return {
      d: linePath === null ? undefined : linePath
    };
  }

  getLineExit() {
    const { hasArea, yScale, xScale, data } = this.props;

    let coords;
    if (hasArea) {
      const maxY = Math.max(...yScale.range());
      coords = data.map((item: any) => ({
        x: xScale(item.x),
        x1: 0,
        y: maxY,
        y1: maxY,
        y0: maxY
      })) as ChartInternalShallowDataShape[];
    } else {
      coords = this.getCoords();
    }

    const linePath = this.getLinePath(coords);

    return {
      d: linePath === null ? undefined : linePath
    };
  }

  render() {
    const { data, color, index, animated, strokeWidth, hasArea } = this.props;
    const coords = this.getCoords();
    const stroke = color(data, index);
    const enterProps = this.getLineEnter(coords);
    const exitProps = this.getLineExit();
    const extras = constructFunctionProps(this.props, data);

    return (
      <Fragment>
        <PosedLine
          {...extras}
          pose="enter"
          poseKey={enterProps.d}
          pointerEvents="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
          enterProps={enterProps}
          exitProps={exitProps}
          index={index}
          areaShown={hasArea}
          ghostPathRef={this.ghostPathRef}
          animated={animated}
        />
        <path
          opacity="0"
          d={enterProps.d}
          ref={this.ghostPathRef}
          pointerEvents="none"
        />
      </Fragment>
    );
  }
}
