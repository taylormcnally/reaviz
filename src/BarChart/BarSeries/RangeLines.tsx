import React, { Component } from 'react';
import { ChartInternalShallowDataShape, Direction } from '../../common/data';
import { motion } from 'framer-motion';
import { DEFAULT_TRANSITION } from '../../common/Motion';

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
  layout: Direction;
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
      y: newY,
      opacity: 1
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
      x: newX,
      opacity: 0
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

  getDelay() {
    const { animated, index, barCount, layout } = this.props;

    let delay = 0;
    if (animated) {
      if (layout === 'vertical') {
        return (index / barCount) * 0.5;
      } else {
        return ((barCount - index) / barCount) * 0.5;
      }
    }

    return delay;
  }

  render() {
    const { color } = this.props;
    const rangeLineHeight = this.getLineHeight();
    const enterProps = this.getEnter(rangeLineHeight);
    const exitProps = this.getExit(rangeLineHeight);
    const { height, width } = this.getHeightWidth(rangeLineHeight);
    const delay = this.getDelay();

    return (
      <motion.rect
        fill={color}
        width={width}
        height={height}
        initial={exitProps}
        animate={enterProps}
        exit={exitProps}
        transition={{
          ...DEFAULT_TRANSITION,
          delay
        }}
      />
    );
  }
}
