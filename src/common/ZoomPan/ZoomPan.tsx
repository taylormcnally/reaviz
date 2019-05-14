import React, { Component } from 'react';
import bind from 'memoize-bind';
import { Pan, PanMoveEvent } from '../Gestures/Pan';
import { panAndZoom } from '../Gestures/Zoom';
import { value, decay, ValueReaction, ColdSubscription } from 'popmotion';
import { clamp } from '@popmotion/popcorn';
// import panAndZoomHoc from 'react-pan-and-zoom-hoc';


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

const PanZoomHoc = panAndZoom('g');

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

  ensureRange(prevOffset: number, delta: number) {
    return true;

    const { contained } = this.props;
    let newOffset = delta + prevOffset;

    if (contained) {
      if (-newOffset <= 0) {
        newOffset = 0;
      } else if (-newOffset > this.getEndOffset()) {
        newOffset = prevOffset;
      }
    }

    return newOffset;
  }

  onPanStart() {
    this.setState({
      isPanning: true
    });

    this.stopDecay();
    this.observer = value(this.props.offsetX);
  }

  onPanMove(x, y) {
    const offsetX = this.ensureRange(0, x);
    const offsetY = this.ensureRange(0, y);

    this.observer && this.observer.update(x);

    this.props.onZoomPan({
      scale: this.props.scale,
      offsetX: x,
      offsetY: y,
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

  timeout: any;

  onZoom(x, y, scale) {
    this.stopDecay();

    this.props.onZoomPan({
      offsetX: x,
      offsetY: y,
      scale,
      type: 'zoom'
    });

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.onZoomEnd();
    }, 500);
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
      zoomStep,
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
      <PanZoomHoc
        x={offsetX}
        y={offsetY}
        scale={scale}
        minScale={1}
        maxScale={10}
        disableScrollZoom={disableMouseWheel}
        onZoom={bind(this.onZoom, this)}
        onPanStart={bind(this.onPanStart, this)}
        onPanMove={bind(this.onPanMove, this)}
        onPanEnd={bind(this.onPanEnd, this)}
      >
        {!disabled && <rect height={height} width={width} opacity={0} />}
        <g
          style={{
            pointerEvents: selection,
            userSelect: selection,
            cursor
          }}
        >
          {children}
        </g>
      </PanZoomHoc>
    )

    /*
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
            zoomStep={zoomStep}
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
    */
  }
}
