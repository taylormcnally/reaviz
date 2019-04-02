import React, { Component, Fragment } from 'react';
import { ChartShallowDataShape, ChartInternalDataTypes } from '../../common/data';
import { formatValue } from '../../common/utils/formatting';
import * as css from './RadialGaugeLabel.module.scss';
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

    return (
      <Fragment>
        <text
          dy="-0.5em"
          x="0"
          y="5"
          textAnchor="middle"
          className={classNames(className, css.valueLabel)}
        >
          {formatValue(data.data as ChartInternalDataTypes)}
        </text>
      </Fragment>
    );
  }
}
