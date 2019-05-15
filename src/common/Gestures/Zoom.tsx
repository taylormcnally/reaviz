import React, { Component, createRef } from 'react';
import { toggleTextSelection } from '../utils/selection';
import { getPointFromTouch, localPoint } from '../utils/position';
import { getDistanceBetweenPoints, between, getMidpoint } from './pinchUtils';
import { identity, scale, smoothMatrix, transform, translate } from 'transformation-matrix';

interface ZoomGestureProps {
  disabled?: boolean;
  maxZoom: number;
  minZoom: number;
  scaleFactor: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  disableMouseWheel?: boolean;
  onZoom: (event: ZoomEvent) => void;
  onZoomEnd: () => void;
}

export interface ZoomEvent {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export class Zoom extends Component<ZoomGestureProps> {
  static defaultProps: Partial<ZoomGestureProps> = {
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    scaleFactor: 0.1,
    minZoom: 1,
    maxZoom: 10
  };

  lastDistance: any;
  firstMidpoint: any;
  timeout: any;
  childRef = createRef<SVGGElement>();
  transformationMatrix: any = identity();
  updating = false;

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

  onTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 2 && this.childRef.current) {
      event.preventDefault();
      event.stopPropagation();
      toggleTextSelection(false);

      const pointA = getPointFromTouch(event.touches[0], this.childRef.current);
      const pointB = getPointFromTouch(event.touches[1], this.childRef.current);
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

      const pointA = getPointFromTouch(event.touches[0], this.childRef.current);
      const pointB = getPointFromTouch(event.touches[1], this.childRef.current);
      const distance = getDistanceBetweenPoints(pointA, pointB);

      const { maxZoom, scaleFactor, offsetX, offsetY, scale, minZoom } = this.props;
      const delta = distance - this.lastDistance;
      const ratio = Math.exp((delta / 30) * scaleFactor);
      const newScale = between(1, maxZoom, scale * ratio);

      if (newScale <= minZoom) {
        return;
      }

      const newOffsetX = Math.min(
        (offsetX - this.firstMidpoint.x) * ratio + this.firstMidpoint.x,
        0
      );

      const newOffsetY = Math.min(
        (offsetY - this.firstMidpoint.y) * ratio + this.firstMidpoint.y,
        0
      );

      if (scale < this.props.maxZoom) {
        this.props.onZoom({
          scale: newScale,
          offsetX: newOffsetX,
          offsetY: newOffsetY
        });
      }

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

  getSnapshotBeforeUpdate() {
    let { offsetX, offsetY, scale: newScale } = this.props;

    if (!this.updating) {
      this.transformationMatrix = smoothMatrix(transform(
        translate(offsetX / 1, offsetY / 1),
        scale(newScale, newScale),
        translate(-offsetX / 1, -offsetY / 1)
      ), 100);
    }

    this.updating = false;

    return null;
  }

  onWheel(event) {
    event.preventDefault();
    const { x, y } = localPoint(event);
    const { scaleFactor } = this.props;
    const step = -event.deltaY > 0 ? scaleFactor + 1 : 1 - scaleFactor;
    this.scale({ step, x, y })
  }

  scale({ step, x, y }) {
    const prevZoomScale = this.props.scale;
    const zoomLevel = prevZoomScale * step;
    const { minZoom, maxZoom, onZoom } = this.props;

    if (zoomLevel > minZoom && zoomLevel < maxZoom) {
      this.transformationMatrix = smoothMatrix(transform(
        translate(x / 1, y / 1),
        scale(zoomLevel, zoomLevel),
        translate(-x / 1, -y / 1)
      ), 100);

      requestAnimationFrame(() => {
        this.updating = true;

        onZoom({
          scale: this.transformationMatrix.a,
          offsetX: this.transformationMatrix.e,
          offsetY: this.transformationMatrix.f
        });
      });
    }
  }

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
