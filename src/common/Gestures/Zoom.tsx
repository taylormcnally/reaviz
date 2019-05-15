import React, { Component, createRef } from 'react';
import { toggleTextSelection } from '../utils/selection';
import { getPointFromTouch, getPointFromMouse } from '../utils/position';
import { getDistanceBetweenPoints, getMidpoint } from './pinchUtils';
import { identity, scale, smoothMatrix, transform, translate, fromObject } from 'transformation-matrix';

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
  transformationMatrix = identity();
  updating = false;


  constructor(props: ZoomGestureProps) {
    super(props);

    this.transformationMatrix = smoothMatrix(transform(
      translate(props.offsetX, props.offsetY)
    ), 100);
  }

  componentDidMount() {
    if (!this.props.disabled) {
      // Manually bind due to pinch issues not being prevented
      // https://github.com/facebook/react/issues/9809
      if (this.childRef.current) {
        this.childRef.current.addEventListener('touchstart', this.onTouchStart);
      }
    }
  }

  componentDidUpdate() {
    let { offsetX: x, offsetY: y, scale: newScale } = this.props;

    if (!this.updating) {
      this.transformationMatrix = smoothMatrix(transform(
        this.transformationMatrix,
        translate(x, y)
      ), 100);
    }

    this.updating = false;
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

      this.scale({
        step,
        x: this.firstMidpoint.x,
        y: this.firstMidpoint.y
      });

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

  onWheel(event) {
    event.preventDefault();
    const point = getPointFromMouse(event);
    const step = this.getStep(event.deltaY);
    this.scale({ step, ...point });
  }

  scale({ step, x, y }) {
    const prevZoomScale = this.props.scale;
    const zoomLevel = prevZoomScale * step;
    const { minZoom, maxZoom, onZoom } = this.props;

    if (zoomLevel > minZoom && zoomLevel < maxZoom) {
      this.updating = true;

      requestAnimationFrame(() => {
        this.transformationMatrix = smoothMatrix(transform(
          translate(x / 1, y / 1),
          scale(zoomLevel, zoomLevel),
          translate(-x / 1, -y / 1)
        ), 100);

        // Clone the object before sending up
        const result = fromObject(this.transformationMatrix);

        onZoom({
          scale: result.a,
          offsetX: result.e,
          offsetY: result.f
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
