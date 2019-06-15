import React, { Component, createRef } from 'react';
import bind from 'memoize-bind';
import { Pan, PanMoveEvent, PanStartEvent, PanEndEvent, PanCancelEvent } from '../Gestures/Pan';
import { Zoom, ZoomEvent } from '../Gestures/Zoom';
import { identity, fromObject, fromDefinition, transform } from 'transformation-matrix';
import { isEqual } from 'lodash-es';

export interface ZoomPanEvent {
  scale: number;
  x: number;
  y: number;
  type: 'zoom' | 'pan';
}

export interface ZoomPanProps {
  height: number;
  width: number;
  scale: number;
  x: number;
  y: number;
  pannable: boolean;
  zoomable: boolean;
  disabled?: boolean;
  maxZoom: number;
  minZoom: number;
  zoomStep: number;
  constrain: boolean;
  decay: boolean;
  disableMouseWheel?: boolean;
  requireZoomModifier?: boolean;
  onZoomPan: (event: ZoomPanEvent) => void;
  onZoom: (event: ZoomEvent) => void;
  onZoomEnd: () => void;
  onPanStart: (event: PanStartEvent) => void;
  onPanMove: (event: PanMoveEvent) => void;
  onPanEnd: (event: PanEndEvent) => void;
  onPanCancel: (event: PanCancelEvent) => void;
}

interface ZoomPanState {
  isZooming: boolean;
  isPanning: boolean;
  matrix: any;
}

export class ZoomPan extends Component<ZoomPanProps, ZoomPanState> {
  static defaultProps: Partial<ZoomPanProps> = {
    maxZoom: 10,
    minZoom: 0,
    zoomStep: 0.1,
    pannable: true,
    zoomable: true,
    constrain: true,
    decay: true,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    scale: 1,
    onPanStart: () => undefined,
    onPanMove: () => undefined,
    onPanEnd: () => undefined,
    onPanCancel: () => undefined,
    onZoom: () => undefined,
    onZoomEnd: () => undefined
  };

  static getDerivedStateFromProps(props: ZoomPanProps, state: ZoomPanState) {
    // TODO: the types in the library don't seem to be correct...
    const matrix = transform((fromDefinition as any)([
      { type: 'translate', tx: props.x, ty: props.y },
      { type: 'scale', sx: props.scale, sy: props.scale }
    ]));

    if (!isEqual(matrix, state.matrix)) {
      return {
        matrix
      };
    }

    return null;
  }

  panRef = createRef<Pan>();
  state: ZoomPanState = {
    isZooming: false,
    isPanning: false,
    matrix: identity()
  };

  onPanStart(event: PanStartEvent) {
    this.setState({
      isPanning: true
    });

    this.props.onPanStart(event);
  }

  onPanMove(event: PanMoveEvent) {
    this.props.onZoomPan({
      scale: this.props.scale,
      x: event.x,
      y: event.y,
      type: 'pan'
    });

    this.props.onPanMove(event);
  }

  onPanEnd(event: PanEndEvent) {
    this.setState({ isPanning: false });
    this.props.onPanEnd(event);
  }

  onZoom(event: ZoomEvent) {
    if (this.panRef.current) {
      this.panRef.current.stopDecay();
    }

    this.props.onZoomPan({
      ...event,
      type: 'zoom'
    });

    this.props.onZoom(event);
  }

  onZoomEnd() {
    this.setState({
      isZooming: false
    });

    this.props.onZoomEnd();
  }

  render() {
    const {
      height,
      width,
      children,
      disabled,
      pannable,
      maxZoom,
      minZoom,
      zoomable,
      scale,
      x,
      y,
      disableMouseWheel,
      constrain,
      decay,
      zoomStep,
      onPanCancel,
      requireZoomModifier
    } = this.props;
    const { isZooming, isPanning } = this.state;
    const cursor = pannable ? 'move' : 'auto';
    const selection = isZooming || isPanning ? 'none' : 'auto';
    const matrix = fromObject(this.state.matrix);

    return (
      <Pan
        x={x}
        y={y}
        scale={scale}
        matrix={matrix}
        constrain={constrain}
        height={height}
        width={width}
        decay={decay}
        disabled={!pannable || disabled}
        ref={this.panRef}
        onPanStart={bind(this.onPanStart, this)}
        onPanMove={bind(this.onPanMove, this)}
        onPanEnd={bind(this.onPanEnd, this)}
        onPanCancel={onPanCancel}
      >
        <g>
          <Zoom
            disabled={!zoomable || disabled}
            scaleFactor={zoomStep}
            disableMouseWheel={disableMouseWheel}
            maxZoom={maxZoom}
            minZoom={minZoom}
            scale={scale}
            x={x}
            y={y}
            requireZoomModifier={requireZoomModifier}
            matrix={matrix}
            onZoom={bind(this.onZoom, this)}
            onZoomEnd={bind(this.onZoomEnd, this)}
          >
            <g style={{ cursor }}>
              {!disabled && <rect height={height} width={width} opacity={0} />}
              <g
                style={{
                  pointerEvents: selection,
                  userSelect: selection
                }}
              >
                {children}
              </g>
            </g>
          </Zoom>
        </g>
      </Pan>
    );
  }
}
