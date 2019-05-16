import React, { Component } from 'react';
import bind from 'memoize-bind';
import { Pan, PanMoveEvent } from '../Gestures/Pan';
import { Zoom, ZoomEvent } from '../Gestures/Zoom';
import { value, decay, ValueReaction, ColdSubscription } from 'popmotion';
import { clamp } from '@popmotion/popcorn';
import { identity, fromObject } from 'transformation-matrix';

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
  onZoomPan: (event: ZoomPanEvent) => void;
}

interface ZoomPanState {
  isZooming: boolean;
  isPanning: boolean;
}

export class ZoomPan extends Component<ZoomPanProps, ZoomPanState> {
  static defaultProps: ZoomPanProps = {
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
    onZoomPan: () => undefined
  };

  observer?: ValueReaction;
  decay?: ColdSubscription;
  matrix: any;

  state: ZoomPanState = {
    isZooming: false,
    isPanning: false
  };

  constructor(props: ZoomPanProps) {
    super(props);

    this.matrix = fromObject({
      ...identity(),
      a: props.scale,
      e: props.x,
      f: props.y
    });
  }

  componentWillUnmount() {
    this.stopDecay();
  }

  stopDecay() {
    if (this.decay && this.decay.stop) {
      this.decay.stop();
    }

    if (this.observer) {
      this.observer.complete();
    }
  }

  onPanStart() {
    this.setState({
      isPanning: true
    });

    this.stopDecay();
    this.observer = value(this.props.x);
  }

  onPanMove(event: PanMoveEvent) {
    this.matrix = fromObject(event.matrix);

    this.observer && this.observer.update(event.x);

    this.props.onZoomPan({
      scale: this.props.scale,
      x: event.x,
      y: event.y,
      type: 'pan'
    });
  }

  onPanEnd() {
    /*
    if (false) {
    // if (this.observer && this.props.decay) {
      const end = this.getEndOffset();
      const constrained = this.props.constrain;

      this.decay = decay({
        from: this.observer.get(),
        velocity: this.observer.getVelocity()
      })
        .pipe(res => {
          return constrained ?
            clamp(-end, 0)(res) :
            res;
        })
        .start({
          update: offset => {
            requestAnimationFrame(() => {
              this.props.onZoomPan({
                scale: this.props.scale,
                offsetX: offset,
                // TODO: Figure out how to do X & Y together
                offsetY: this.props.offsetY,
                type: 'pan'
              });
            });
          },
          complete: () => this.setState({ isPanning: false })
        });
    } else {
      */
      this.setState({ isPanning: false });
    // }
  }

  onZoom(event: ZoomEvent) {
    this.stopDecay();
    this.matrix = fromObject(event.matrix);

    this.props.onZoomPan({
      ...event,
      type: 'zoom'
    });
  }

  onZoomEnd() {
    this.setState({
      isZooming: false
    });
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
      constrain
    } = this.props;
    const { isZooming, isPanning } = this.state;
    const cursor = pannable ? 'move' : 'auto';
    const selection = isZooming || isPanning ? 'none' : 'auto';
    const matrix = fromObject(this.matrix);

    return (
      <Pan
        x={x}
        y={y}
        scale={scale}
        matrix={matrix}
        constrain={constrain}
        height={height}
        width={width}
        disabled={!pannable || disabled}
        onPanStart={bind(this.onPanStart, this)}
        onPanMove={bind(this.onPanMove, this)}
        onPanEnd={bind(this.onPanEnd, this)}
      >
        <g>
          <Zoom
            disabled={!zoomable || disabled}
            disableMouseWheel={disableMouseWheel}
            maxZoom={maxZoom}
            minZoom={minZoom}
            scale={scale}
            x={x}
            y={y}
            constrain={constrain}
            height={height}
            width={width}
            onZoom={bind(this.onZoom, this)}
            onZoomEnd={bind(this.onZoomEnd, this)}
            matrix={matrix}
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
