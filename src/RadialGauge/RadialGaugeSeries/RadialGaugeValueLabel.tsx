import React, { Component } from 'react';
import { ChartShallowDataShape } from '../../common/data';
import CountUp from 'react-countup';
import classNames from 'classnames';
import * as css from './RadialGaugeValueLabel.module.scss';

export interface RadialGaugeValueLabelProps {
  data: ChartShallowDataShape;
  className?: any;
}

export class RadialGaugeValueLabel extends Component<RadialGaugeValueLabelProps> {
  static defaultProps: Partial<RadialGaugeValueLabelProps> = {};

  render() {
    const { data, className } = this.props;

    // TODO: Get seperator based on locale
    return (
      <CountUp start={0} end={data.data} delay={0} duration={1} separator=",">
        {({ countUpRef }) =>
          <text
            dy="-0.5em"
            x="0"
            y="15"
            textAnchor="middle"
            className={classNames(className, css.valueLabel)}
            ref={countUpRef}
          />
        }
      </CountUp>
    );
  }
}
