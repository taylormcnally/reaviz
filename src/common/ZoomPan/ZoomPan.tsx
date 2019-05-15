import React, { Component } from 'react';
import bind from 'memoize-bind';
import { Pan, PanMoveEvent } from '../Gestures/Pan';
import { Zoom, ZoomEvent } from '../Gestures/Zoom';
import { value, decay, ValueReaction, ColdSubscription } from 'popmotion';
import { clamp } from '@popmotion/popcorn';

export interface ZoomPanEvent {
  scale: number;
  offsetX: number;
  offsetY: number;
  type: 'zoom' | 'pan';
}

export interface ZoomPanProps {
  height: number;
  width: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  pannable: boolean;
  zoomable: boolean;
  disabled?: boolean;
  maxZoom: number;
  minZoom: number;
  zoomStep: number;
  contained: boolean;
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
    contained: true,
    decay: true,
    height: 0,
    width: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    onZoomPan: () => undefined
  };

  observer?: ValueReaction;
  decay?: ColdSubscription;
  rqf?: any;

  constructor(props: ZoomPanProps) {
    super(props);

    this.state = {
      isZooming: false,
      isPanning: false
    };
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

  getEndOffset() {
    const { width, scale } = this.props;
    return width * scale! - width;
  }

  ensureRange(offset: number) {
    const { contained } = this.props;

    if (contained) {
      if (-offset <= 0) {
        offset = 0;
      } else if (-offset > this.getEndOffset()) {
        offset = offset;
      }
    }

    return offset;
  }

  onPanStart() {
    this.setState({
      isPanning: true
    });

    this.stopDecay();
    this.observer = value(this.props.offsetX);
  }

  onPanMove(event: any) {
    const offsetX = this.ensureRange(event.offsetX);
    const offsetY = this.ensureRange(event.offsetY);

    this.observer && this.observer.update(offsetX);

    this.props.onZoomPan({
      scale: this.props.scale,
      offsetX,
      offsetY,
      type: 'pan'
    });
  }

  onPanEnd() {
    if (this.observer && this.props.decay) {
      const end = this.getEndOffset();

      this.decay = decay({
        from: this.observer.get(),
        velocity: this.observer.getVelocity()
      })
        .pipe(clamp(-end, 0))
        .start({
          update: offset => {
            cancelAnimationFrame(this.rqf);

            this.rqf = requestAnimationFrame(() => {
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
      this.setState({ isPanning: false });
    }
  }

  onZoom(event: ZoomEvent) {
    this.stopDecay();
    const inRange = this.ensureRange(event.offsetX);

    if (inRange) {
      this.props.onZoomPan({
        ...event,
        type: 'zoom'
      });
    }
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
      offsetX,
      offsetY,
      disableMouseWheel
    } = this.props;
    const { isZooming, isPanning } = this.state;
    const cursor = pannable ? 'move' : 'auto';
    const selection = isZooming || isPanning ? 'none' : 'auto';

    return (
      <Pan
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
            offsetX={offsetX}
            offsetY={offsetY}
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
