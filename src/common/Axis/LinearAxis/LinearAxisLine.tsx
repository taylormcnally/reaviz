import React, { Fragment, Component } from 'react';
import { GradientProps } from '../../Styles';
import { CloneElement } from '../../utils';

export interface LinearAxisLineProps {
  height: number;
  width: number;
  strokeColor?: string;
  strokeWidth: number;
  strokeGradient: JSX.Element | null;
  scale: any;
  orientation: 'horizontal' | 'vertical';
}

interface LinearAxisLineState {
  id: string;
}

let axisLineId = 0;

export class LinearAxisLine extends Component<
  LinearAxisLineProps,
  LinearAxisLineState
> {
  static defaultProps: Partial<LinearAxisLineProps> = {
    strokeColor: '#8F979F',
    strokeWidth: 1
  };

  state: LinearAxisLineState = {
    id: (axisLineId++).toString()
  };

  render() {
    const { strokeColor, strokeGradient, scale, orientation } = this.props;
    const { id } = this.state;
    const [range0, range1] = scale.range();

    return (
      <Fragment>
        <line
          x1={orientation === 'vertical' ? 0 : range0}
          // Workaround for a Chrome/Firefox bug where it won't render gradients for straight lines
          x2={orientation === 'vertical' ? 0.00001 : range1}
          y1={orientation === 'vertical' ? range0 : 0}
          y2={orientation === 'vertical' ? range1 : 0.00001}
          strokeWidth={1}
          stroke={strokeGradient ? `url(#axis-gradient-${id})` : strokeColor}
        />
        {strokeGradient && (
          <CloneElement<GradientProps>
            element={strokeGradient}
            id={`axis-gradient-${id}`}
          />
        )}
      </Fragment>
    );
  }
}
