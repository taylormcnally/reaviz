import React, { Component, ReactNode, ReactElement } from 'react';
import css from './DiscreteLegendEntry.module.scss';
import classNames from 'classnames';
import {
  DiscreteLegendSymbol,
  DiscreteLegendSymbolProps
} from './DiscreteLegendSymbol';
import { CloneElement } from '../../utils/children';

export interface DiscreteLegendEntryProps {
  label: string;
  color: string;
  symbol:
    | ReactElement<DiscreteLegendSymbolProps, typeof DiscreteLegendSymbol>
    | ReactNode;
  active?: boolean;
  style?: any;
  className?: any;
  orientation: 'horizontal' | 'vertical';
  onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: (event: React.MouseEvent<HTMLDivElement>) => void;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export class DiscreteLegendEntry extends Component<DiscreteLegendEntryProps> {
  static defaultProps: Partial<DiscreteLegendEntryProps> = {
    symbol: <DiscreteLegendSymbol />,
    orientation: 'horizontal',
    onMouseEnter: () => undefined,
    onMouseLeave: () => undefined,
    onClick: () => undefined
  };

  render() {
    const {
      label,
      symbol,
      onMouseEnter,
      onMouseLeave,
      color,
      style,
      onClick,
      active,
      orientation
    } = this.props;
    const className = classNames(css.entry, this.props.className, {
      [css.inactive]: active === false,
      [css.vertical]: orientation === 'vertical',
      [css.horizontal]: orientation === 'horizontal'
    });

    return (
      <div
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={style}
      >
        <CloneElement<DiscreteLegendSymbolProps>
          element={symbol}
          color={color}
        />
        <span className={css.label}>{label}</span>
      </div>
    );
  }
}
