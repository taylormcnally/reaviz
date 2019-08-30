import React, { Component } from 'react';
import {
  ChartShallowDataShape,
  ChartInternalDataTypes
} from '../../common/data';
import { formatValue } from '../../common/utils/formatting';
import * as css from './RadialGaugeLabel.module.scss';
import classNames from 'classnames';

export interface RadialGaugeLabelProps {
  data: ChartShallowDataShape;
  offset: number;
  className?: any;
  onClick: (e: { data; nativeEvent }) => void;
}

export class RadialGaugeLabel extends Component<RadialGaugeLabelProps> {
  static defaultProps: Partial<RadialGaugeLabelProps> = {
    onClick: () => undefined
  };

  render() {
    const { data, className, offset, onClick } = this.props;
    const label = formatValue(data.key as ChartInternalDataTypes);

    return (
      <text
        dy="1.23em"
        x="0"
        y={offset}
        textAnchor="middle"
        onClick={nativeEvent => onClick({ data, nativeEvent })}
        className={classNames(className, css.valueLabel)}
      >
        {label}
      </text>
    );
  }
}
