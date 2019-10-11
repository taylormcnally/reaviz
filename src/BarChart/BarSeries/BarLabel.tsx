import React, { PureComponent } from 'react';
import { ChartInternalShallowDataShape, Direction } from '../../common/data';
import { BarType } from './Bar';
import { motion } from 'framer-motion';
import { DEFAULT_TRANSITION } from '../../common/Motion';

export interface BarLabelProps {
  text: string;
  height: number;
  width: number;
  x: number;
  y: number;
  index: number;
  scale: any;
  position: 'top' | 'center' | 'bottom';
  data: ChartInternalShallowDataShape;
  fill: string;
  barCount: number;
  layout: Direction;
  animated: boolean;
  type: BarType;
  fontSize: number;
  padding: number;
  fontFamily: string;
  className?: any;
}

export class BarLabel extends PureComponent<BarLabelProps> {
  static defaultProps: Partial<BarLabelProps> = {
    position: 'top',
    layout: 'vertical',
    fontSize: 13,
    padding: 5,
    fontFamily: 'sans-serif',
    fill: '#000'
  };

  getIsVertical() {
    return this.props.layout === 'vertical';
  }

  getEnter() {
    const { x, y, height, position, width, data, padding } = this.props;

    const isVertical = this.getIsVertical();
    let newY = y;
    let newX = x;

    // If its diverging and the value is negative, we
    // need to reverse the type...
    const isTop = position === 'top';
    const direction = isVertical
      ? data.y < 0 && isTop
        ? 'bottom'
        : position
      : data.x0 < 0 && isTop
      ? 'bottom'
      : position;

    if (isVertical) {
      if (direction === 'top') {
        newY = y - padding;
      } else if (direction === 'center') {
        newY = y + height / 2;
      } else if (direction === 'bottom') {
        newY = y + height - padding;
      }
      newX = newX + width / 2;
    } else {
      if (direction === 'top') {
        newX = x + width + padding;
      } else if (direction === 'center') {
        newX = x + width / 2;
      } else if (direction === 'bottom') {
        newX = x + padding;
      }
      newY = newY + height / 2;
    }

    return {
      translateX: newX,
      translateY: newY,
      opacity: 1
    };
  }

  getExit() {
    const { x, scale, height, width, y, position, type, padding } = this.props;

    const isVertical = this.getIsVertical();
    let newY = y;
    let newX = x;

    if (isVertical) {
      const maxY = Math.max(...scale.range());
      if (position === 'top') {
        newY = maxY;
      } else {
        newY = maxY + height + padding;
      }

      newX = newX + width / 2;
    } else {
      const minX = Math.min(...scale.range());
      if (position === 'top') {
        newX = minX;
      } else {
        newX = minX + width + padding;
      }

      newY = newY + height / 2;
    }

    if (type === 'stackedDiverging') {
      if (isVertical) {
        newY = newY / 2;
      } else {
        newX = newX / 2;
      }
    }

    return {
      translateY: newY,
      translateX: newX,
      opacity: 0
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
    const { fontSize, fontFamily, fill, className, text } = this.props;
    const enterProps = this.getEnter();
    const exitProps = this.getExit();
    const delay = this.getDelay();
    const textAnchor = this.getIsVertical() ? 'middle' : 'start';

    return (
      <motion.g
        initial={exitProps}
        animate={enterProps}
        exit={exitProps}
        transition={{
          ...DEFAULT_TRANSITION,
          delay
        }}
        fontSize={fontSize}
        fontFamily={fontFamily}
      >
        <text fill={fill} className={className} textAnchor={textAnchor}>
          {text}
        </text>
      </motion.g>
    );
  }
}
