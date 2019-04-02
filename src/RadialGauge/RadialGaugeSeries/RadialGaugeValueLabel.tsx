import React, { Component } from 'react';
import { ChartShallowDataShape, ChartInternalDataTypes } from '../../common/data';
import { formatValue } from '../../common/utils/formatting';
import * as css from './RadialGaugeValueLabel.module.scss';
import classNames from 'classnames';

export interface RadialGaugeValueLabelProps {
  data: ChartShallowDataShape;
  animated: boolean;
  className?: any;
}

export class RadialGaugeValueLabel extends Component<RadialGaugeValueLabelProps> {
  static defaultProps: Partial<RadialGaugeValueLabelProps> = {
    animated: true
  };

  render() {
    const { data, className } = this.props;
    const label = formatValue(data.data as ChartInternalDataTypes);

    return (
      <text
        dy="-0.5em"
        x="0"
        y="15"
        textAnchor="middle"
        className={classNames(className, css.valueLabel)}
      >
        {label}
      </text>
    );
  }
}
