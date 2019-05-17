import React, { Component, createRef } from 'react';
import { toggleTextSelection } from '../utils/selection';
import { getPointFromTouch, getPointFromMatrix, isZoomLevelGoingOutOfBounds } from '../utils/position';
import { getDistanceBetweenPoints, getMidpoint } from './pinchUtils';
import { scale, smoothMatrix, transform, translate } from 'transformation-matrix';

interface ZoomGestureProps {
  disabled?: boolean;
  maxZoom: number;
  minZoom: number;
  scaleFactor: number;
  scale: number;
  matrix: any;
  x: number;
  y: number;
  disableMouseWheel?: boolean;
  onZoom: (event: ZoomEvent) => void;
  onZoomEnd: () => void;
}

export interface ZoomEvent {
  scale: number;
  x: number;
  y: number;
}

export class Zoom extends Component<ZoomGestureProps> {
  static defaultProps: Partial<ZoomGestureProps> = {
    x: 0,
    y: 0,
    scale: 1,
    scaleFactor: 0.1,
    minZoom: 1,
    maxZoom: 10
  };

  lastDistance: any;
  firstMidpoint: any;
  timeout: any;
  childRef = createRef<SVGGElement>();

  componentDidMount() {
    if (!this.props.disabled) {
      // Manually bind due to pinch issues not being prevented
      // https://github.com/facebook/react/issues/9809
      if (this.childRef.current) {
        this.childRef.current.addEventListener('touchstart', this.onTouchStart);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    toggleTextSelection(true);
  }

  getStep(delta: number) {
    const { scaleFactor } = this.props;
    return -delta > 0 ? scaleFactor + 1 : 1 - scaleFactor;
  }

  scale(x: number, y: number, step: number) {
    const { minZoom, maxZoom, onZoom, matrix } = this.props;

    const outside = isZoomLevelGoingOutOfBounds({
      d: matrix.a,
      scaleFactorMin: minZoom,
      scaleFactorMax: maxZoom
    }, step);

    if (!outside) {
      let newMatrix = smoothMatrix(transform(
        matrix,
        translate(x, y),
        scale(step, step),
        translate(-x, -y)
      ), 100);

      requestAnimationFrame(() => {
        onZoom({
          scale: newMatrix.a,
          x: newMatrix.e,
          y: newMatrix.f
        });
      });
    }
  }

  onWheel(event: MouseWheelEvent) {
    if (!this.props.disableMouseWheel) {
      event.preventDefault();
      const { x, y } = getPointFromMatrix(event, this.props.matrix);
      const step = this.getStep(event.deltaY);
      this.scale(x, y, step);
    }
  }

  onTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 2 && this.childRef.current) {
      event.preventDefault();
      event.stopPropagation();
      toggleTextSelection(false);

      const [pointA, pointB] = getPointFromTouch(this.childRef.current, event);

      this.lastDistance = getDistanceBetweenPoints(pointA, pointB);
      this.firstMidpoint = getMidpoint(pointA, pointB);

      window.addEventListener('touchmove', this.onTouchMove);
      window.addEventListener('touchend', this.onTouchEnd);
    }
  };

  onTouchMove = (event: TouchEvent) => {
    if (event.touches.length === 2 && this.childRef.current) {
      event.preventDefault();
      event.stopPropagation();

      const [pointA, pointB] = getPointFromTouch(this.childRef.current, event);
      const distance = getDistanceBetweenPoints(pointA, pointB);
      const delta = distance - this.lastDistance;
      const step = this.getStep(-delta);

      this.scale(this.firstMidpoint.x, this.firstMidpoint.y, step);

      this.lastDistance = distance;
    }
  };

  onTouchEnd = (event: TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();

    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

    toggleTextSelection(true);
    this.props.onZoomEnd();
  };

  render() {
    return React.Children.map(this.props.children, (child: any) =>
      React.cloneElement(child, {
        ...child.props,
        ref: this.childRef,
        onWheel: e => {
          this.onWheel(e);
          if (child.props.onWheel) {
            child.props.onWheel(e);
          }
        }
      })
    );
  }
}
