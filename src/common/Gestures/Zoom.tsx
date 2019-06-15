import { Component, createRef, Children, cloneElement } from 'react';
import { toggleTextSelection } from '../utils/selection';
import {
  getPointFromMatrix,
  isZoomLevelGoingOutOfBounds
} from '../utils/position';
import { getTouchPoints } from './pinchUtils';
import {
  scale,
  smoothMatrix,
  transform,
  translate,
  applyToPoint,
  inverse
} from 'transformation-matrix';

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
  requireZoomModifier?: boolean;
  onZoom: (event: ZoomEvent) => void;
  onZoomEnd: () => void;
}

export interface ZoomEvent {
  scale: number;
  x: number;
  y: number;
  nativeEvent: any;
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

  firstTouch: any;
  lastDistance: any;
  timeout: any;
  childRef = createRef<SVGGElement>();

  componentDidMount() {
    const { disabled, disableMouseWheel } = this.props;

    if (!disabled && this.childRef.current) {
      if (!disableMouseWheel) {
        this.childRef.current.addEventListener('mousewheel', this.onMouseWheel, { passive: false });
      }

      this.childRef.current.addEventListener('touchstart', this.onTouchStart, { passive: false });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

    if (this.childRef.current) {
      this.childRef.current.removeEventListener('mousewheel', this.onMouseWheel);
      this.childRef.current.removeEventListener('touchstart', this.onTouchStart);
    }

    toggleTextSelection(true);
  }

  getStep(delta: number) {
    const { scaleFactor } = this.props;
    return -delta > 0 ? scaleFactor + 1 : 1 - scaleFactor;
  }

  scale(x: number, y: number, step: number, nativeEvent) {
    const { minZoom, maxZoom, onZoom, matrix } = this.props;

    const outside = isZoomLevelGoingOutOfBounds(
      {
        d: matrix.a,
        scaleFactorMin: minZoom,
        scaleFactorMax: maxZoom
      },
      step
    );

    if (!outside) {
      const newMatrix = smoothMatrix(
        transform(
          matrix,
          translate(x, y),
          scale(step, step),
          translate(-x, -y)
        ),
        100
      );

      requestAnimationFrame(() => {
        onZoom({
          scale: newMatrix.a,
          x: newMatrix.e,
          y: newMatrix.f,
          nativeEvent
        });
      });
    }

    return outside;
  }

  onMouseWheel = (event: MouseWheelEvent) => {
    const { disableMouseWheel, requireZoomModifier, matrix, onZoomEnd } = this.props;

    if (disableMouseWheel) {
      return false;
    }

    const hasModifier = event.metaKey || event.ctrlKey;
    if (requireZoomModifier && !hasModifier) {
      return false;
    }

    event.preventDefault();
    event.stopPropagation();

    const point = getPointFromMatrix(event, matrix);
    if (point) {
      const { x, y } = point;
      const step = this.getStep(event.deltaY);

      this.scale(x, y, step, event);

      // Do small timeout to 'guess' when its done zooming
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => onZoomEnd(), 500);
    }
  };

  onTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 2) {
      event.preventDefault();
      event.stopPropagation();
      toggleTextSelection(false);

      this.firstTouch = getTouchPoints(event, this.childRef.current);
      this.lastDistance = this.firstTouch.distance;

      window.addEventListener('touchmove', this.onTouchMove);
      window.addEventListener('touchend', this.onTouchEnd);
    }
  };

  onTouchMove = (event: TouchEvent) => {
    if (event.touches.length === 2) {
      event.preventDefault();
      event.stopPropagation();

      const { distance } = getTouchPoints(event, this.childRef.current);
      const distanceFactor = distance / this.lastDistance;

      const point = applyToPoint(inverse(this.props.matrix), {
        x: this.firstTouch.midpoint.x,
        y: this.firstTouch.midpoint.y
      });

      if (point.x && point.y) {
        const outside = this.scale(point.x, point.y, distanceFactor, event);

        if (!outside) {
          this.lastDistance = distance;
        }
      }
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
    return Children.map(this.props.children, (child: any) =>
      cloneElement(child, {
        ...child.props,
        ref: this.childRef
      })
    );
  }
}
