import React, { Component } from 'react';

export interface GradientStopProps {
  offset: number | string;
  stopOpacity: number | string;
  color?: string;
}

export class GradientStop extends Component<GradientStopProps> {
  render() {
    const { offset, stopOpacity, color } = this.props;

    return (
      <stop
        offset={offset}
        stopOpacity={stopOpacity}
        stopColor={color}
      />
    );
  }
}
