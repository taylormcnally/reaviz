import React, { Component, Fragment } from 'react';
import { ChartShallowDataShape, ChartInternalDataTypes } from '../../common/data';
import { formatValue } from '../../common/utils/formatting';
import * as css from './RadialGaugeLabel.module.scss';
import classNames from 'classnames';

export interface RadialGaugeLabelProps {
  data: ChartShallowDataShape;
  className?: any;
}

export class RadialGaugeLabel extends Component<RadialGaugeLabelProps> {
  static defaultProps: Partial<RadialGaugeLabelProps> = {
  };

  render() {
    const { data, className } = this.props;

    return (
      <Fragment>
        <text
          dy="1.23em"
          x="0"
          y="50"
          textAnchor="middle"
          className={classNames(className, css.valueLabel)}
        >
          {formatValue(data.key as ChartInternalDataTypes)}
        </text>
      </Fragment>
    );
  }
}
