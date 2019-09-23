import React, { PureComponent } from 'react';
import css from './DiscreteLegendSymbol.module.scss';
import classNames from 'classnames';

export interface DiscreteLegendSymbolProps {
  color: string;
  className?: any;
}

export class DiscreteLegendSymbol extends PureComponent<
  DiscreteLegendSymbolProps
> {
  static defaultProps: Partial<DiscreteLegendSymbolProps> = {};

  render() {
    const { className, color } = this.props;

    return (
      <div
        className={classNames(css.symbol, className)}
        style={{ background: color }}
      />
    );
  }
}
