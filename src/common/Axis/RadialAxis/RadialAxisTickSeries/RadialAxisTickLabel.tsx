import React, { Component } from 'react';
import { formatValue } from '../../../utils/formatting';

export interface RadialAxisTickLabelProps {
  data: any;
  lineSize: number;
  rotation: number;
  fill: string;
  fontSize: number;
  fontFamily: string;
  index: number;
  format?: (value: any, index: number) => any | string;
}

export class RadialAxisTickLabel extends Component<RadialAxisTickLabelProps> {
  static defaultProps: Partial<RadialAxisTickLabelProps> = {
    fill: '#3B5F6A',
    fontSize: 11,
    fontFamily: 'sans-serif'
  };

  render() {
    const {
      data,
      fill,
      fontFamily,
      fontSize,
      format,
      lineSize,
      rotation,
      index
    } = this.props;
    const text = format ? format(data, index) : formatValue(data);
    const shouldRotate = rotation > 100 && rotation;
    const rotate = shouldRotate ? 180 : 0;
    const translate = shouldRotate ? -30 : 0;
    const textAnchor = shouldRotate ? 'end' : 'start';

    return (
      <g transform={`rotate(${rotate}) translate(${translate})`}>
        <title>{text}</title>
        <text
          dy="0.35em"
          x={lineSize + 5}
          textAnchor={textAnchor}
          fill={fill}
          fontFamily={fontFamily}
          fontSize={fontSize}
        >
          {text}
        </text>
      </g>
    );
  }
}
