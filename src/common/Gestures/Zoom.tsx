import React, { Component, createRef } from 'react';
import { toggleTextSelection } from '../utils/selection';
import { getPointFromTouch, getPointFromMatrix } from '../utils/position';
import { getDistanceBetweenPoints, getMidpoint } from './pinchUtils';
import { identity, scale, smoothMatrix, transform, translate, fromObject } from 'transformation-matrix';

interface ZoomGestureProps {
  disabled?: boolean;
  maxZoom: number;
  minZoom: number;
  scaleFactor: number;
  scale: number;
  matrix: any;
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
    this.transformationMatrix = fromObject(props.matrix);
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
    if (!this.updating) {
      this.transformationMatrix = fromObject(this.props.matrix);
     this.updating = false;
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
    const point = getPointFromMatrix(event, this.transformationMatrix);
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
        const matrix = transform(
          this.transformationMatrix,
          translate(x, y),
          scale(zoomLevel, zoomLevel),
          translate(-x, -y)
        );

        // Clone the object before sending up
        const result = fromObject(smoothMatrix(matrix, 100));

        onZoom({
          scale: result.a,
          offsetX: result.e,
          offsetY: result.f,
          matrix: result
        } as any);

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.updating = false, 100);
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
