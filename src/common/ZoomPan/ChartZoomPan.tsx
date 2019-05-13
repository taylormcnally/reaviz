import React, { Component } from 'react';
import bind from 'memoize-bind';
import { ZoomPan, ZoomPanEvent } from './ZoomPan';
import { ChartInternalDataShape, ChartDataTypes } from '../data';
import { getXScale } from '../scales';

export interface ZoomPanChangeEvent {
  domain: [ChartDataTypes, ChartDataTypes];
  isZoomed: boolean;
}

export interface ChartZoomPanProps {
  data: ChartInternalDataShape[];
  domain?: [ChartDataTypes, ChartDataTypes];
  axisType: 'value' | 'time' | 'category' | 'duration';
  roundDomains: boolean;
  onZoomPan?: (event: ZoomPanChangeEvent) => void;
  height: number;
  width: number;
  scale: number;
  offset: number;
  pannable: boolean;
  zoomable: boolean;
  disabled?: boolean;
  maxZoom: number;
  zoomStep: number;
  decay: boolean;
  disableMouseWheel?: boolean;
}

export class ChartZoomPan extends Component<ChartZoomPanProps> {
  static defaultProps: Partial<ChartZoomPanProps> = {
    onZoomPan: () => undefined
  };

  onZoomPan(event: ZoomPanEvent) {
    const { width, data, axisType, roundDomains, onZoomPan } = this.props;
    const can = event.type === 'zoom' || (event.type === 'pan' && event.scale > 1);

    if (can) {
      const scale: any = getXScale({
        width: width,
        type: axisType,
        roundDomains,
        data
      });

      const newScale = scale.copy().domain(
        scale
          .range()
          .map(x => (x - event.offsetX) / event.scale)
          .map(scale.invert, event.offsetX)
      );

      onZoomPan!({
        domain: newScale.domain(),
        isZoomed: event.scale !== 1
      });
    }
  }

  getOffset() {
    let zoomOffset = {
      scale: undefined,
      offsetX: undefined
    } as any;

    const {
      disabled,
      domain,
      width,
      data,
      axisType,
      roundDomains
    } = this.props;

    if (!disabled && domain) {
      const xScale: any = getXScale({
        width,
        type: axisType,
        roundDomains,
        data
      });

      let offset = xScale(domain[0]);
      const endOffset = xScale(domain[1]);
      const scale = width / (endOffset - offset);

      // Apply the new scale to the offset so its scaled correctly
      offset = offset * scale;

      zoomOffset = {
        scale: scale,
        offsetX: -offset
      };
    }

    return zoomOffset;
  }

  render() {
    const { data, height, children, width, onZoomPan, ...rest } = this.props;
    const { scale, offsetX } = this.getOffset();

    return (
      <ZoomPan
        {...rest}
        scale={scale}
        offsetX={offsetX}
        height={height}
        width={width}
        pannable={scale > 1}
        onZoomPan={bind(this.onZoomPan, this)}
      >
        {children}
      </ZoomPan>
    );
  }
}
