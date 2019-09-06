import React, { Component } from 'react';
import css from './SequentialLegend.module.scss';
import classNames from 'classnames';

export interface SequentialLegendProps {
  className?: any;
  style?: any;
  orientation?: 'horizontal' | 'vertical';
}

export class SequentialLegend extends Component<SequentialLegendProps> {
  render() {
    const { orientation } = this.props;

    /*
      background: linear-gradient(
        rgb(255, 111, 0) 0%,
        rgb(255, 143, 0) 10%,
        rgb(255, 160, 0) 20%,
        rgb(255, 179, 0) 30%,
        rgb(255, 193, 7) 40%,
        rgb(255, 202, 40) 50%,
        rgb(255, 213, 79) 60%,
        rgb(255, 224, 130) 70%,
        rgb(255, 236, 179) 80%,
        rgb(255, 248, 225) 90%
      );
    */

    return (
      <div
        className={classNames(css.container, {
          [css.vertical]: orientation === 'vertical',
          [css.horizontal]: orientation === 'horizontal'
        })}
      >
        <div className={css.start}></div>
        <div className={css.gradient}></div>
        <div className={css.end}></div>
      </div>
    );
  }
}
