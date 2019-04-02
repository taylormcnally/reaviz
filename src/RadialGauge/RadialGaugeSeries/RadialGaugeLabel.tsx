import React, { Component } from 'react';
import { ChartShallowDataShape, ChartInternalDataTypes } from '../../common/data';
import { formatValue } from '../../common/utils/formatting';
import * as css from './RadialGaugeLabel.module.scss';
import classNames from 'classnames';

export interface RadialGaugeLabelProps {
  data: ChartShallowDataShape;
  className?: any;
}

export class RadialGaugeLabel extends Component<RadialGaugeLabelProps> {
  static defaultProps: Partial<RadialGaugeLabelProps> = {};

  render() {
    const { data, className } = this.props;
    const label = formatValue(data.key as ChartInternalDataTypes);

    return (
      <text
        dy="1.23em"
        x="0"
        y="60"
        textAnchor="middle"
        className={classNames(className, css.valueLabel)}
      >
        {label}
      </text>
    );
  }
}
