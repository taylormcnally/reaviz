import React, { Component } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { PosedRangeLine } from './PosedRangeLines';

export interface RangeLinesProps {
  height: number;
  width: number;
  x: number;
  y: number;
  index: number;
  strokeWidth: number;
  scale: any;
  type: 'top' | 'bottom';
  data: ChartInternalShallowDataShape;
  color: string;
  barCount: number;
  layout: 'vertical' | 'horizontal';
  animated: boolean;
}

export class RangeLines extends Component<RangeLinesProps> {
  static defaultProps: Partial<RangeLinesProps> = {
    type: 'top',
    strokeWidth: 1,
    layout: 'vertical'
  };

  getIsVertical() {
    return this.props.layout === 'vertical';
  }

  getEnter(rangeLineHeight: number) {
    const { x, y, height, type, width } = this.props;

    const isVertical = this.getIsVertical();
    let newY = y;
    let newX = x;

    if (isVertical) {
      if (type !== 'bottom') {
        newY = y;
      } else {
        newY = y + height - rangeLineHeight;
      }
    } else {
      if (type !== 'bottom') {
        newX = x + width - rangeLineHeight;
      } else {
        newX = x;
      }
    }

    return {
      x: newX,
      y: newY
    };
  }

  getExit(rangeLineHeight: number) {
    const { x, scale, height, width, y, type } = this.props;

    const isVertical = this.getIsVertical();
    let newY = y;
    let newX = x;

    if (isVertical) {
      const maxY = Math.max(...scale.range());
      if (type !== 'bottom') {
        newY = maxY;
      } else {
        newY = maxY + height - rangeLineHeight;
      }
    } else {
      const minX = Math.min(...scale.range());
      if (type !== 'bottom') {
        newX = minX;
      } else {
        newX = minX + width - rangeLineHeight;
      }
    }

    return {
      y: newY,
      x: newX
    };
  }

  getLineHeight() {
    const { height, width, strokeWidth } = this.props;
    const isVertical = this.getIsVertical();

    return Math.min(strokeWidth, isVertical ? height : width);
  }

  getHeightWidth(rangeLineHeight: number) {
    const { height, width } = this.props;
    const isVertical = this.getIsVertical();

    return {
      width: isVertical ? width : rangeLineHeight,
      height: isVertical ? rangeLineHeight : height
    };
  }

  render() {
    const { color, data, animated, index, barCount, layout } = this.props;
    const rangeLineHeight = this.getLineHeight();
    const enterProps = this.getEnter(rangeLineHeight);
    const exitProps = this.getExit(rangeLineHeight);
    const { height, width } = this.getHeightWidth(rangeLineHeight);

    return (
      <PosedRangeLine
        pose="enter"
        poseKey={data}
        fill={color}
        layout={layout}
        enterProps={enterProps}
        exitProps={exitProps}
        height={height}
        barCount={barCount}
        width={width}
        index={index}
        animated={animated}
      />
    );
  }
}
