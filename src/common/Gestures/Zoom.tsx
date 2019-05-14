import React, { Component, createRef } from 'react';
import { toggleTextSelection } from '../utils/selection';
import { getPointFromTouch, getPositionForTarget } from '../utils/position';
import { getDistanceBetweenPoints, between, getMidpoint } from './pinchUtils';
import ReactDOM from 'react-dom';

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
    offsetX: 0.5,
    offsetY: 0.5,
    scale: 1,
    scaleFactor: 0.2,
    minZoom: 1, // Number.EPSILON,
    maxZoom: 10 //Number.POSITIVE_INFINITY,
  }


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

    /*
  onWheel(event: React.MouseEvent) {
    const {
      disabled,
      maxZoom,
      zoomStep,
      scale,
      offsetX,
      offsetY,
      onZoomEnd,
      disableMouseWheel,
      minZoom
    } = this.props;

    if (!disabled && !disableMouseWheel) {
      const nativeEvent = event.nativeEvent as WheelEvent;
      const position = this.getNewPosition();

      const positions = getPositionForTarget(nativeEvent);
      const wheel = (nativeEvent.deltaY / 120) * -1;
      const ratio = Math.exp(wheel * zoomStep);
      const roundedScale = Math.ceil(scale * ratio);
      const inBounds = roundedScale <= maxZoom && roundedScale >= minZoom;

      console.log('here', roundedScale);

      if (inBounds && roundedScale !== scale) {
        // nativeEvent.preventDefault();

        const newScale = between(minZoom, maxZoom, scale * ratio);


        const newOffsetX = Math.min(
          (offsetX - positions.x) * ratio + positions.x,
          0
        );

        const newOffsetY = Math.min(
          (offsetY - positions.y) * ratio + positions.y,
          0
        );

        this.props.onZoom({
          scale: newScale,
          offsetX: newOffsetX,
          offsetY: newOffsetY
        });

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          onZoomEnd();
        }, 500);
      }
    }
  }

    disabled?: boolean;
  maxZoom: number;
  minZoom: number;
  zoomStep: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  disableMouseWheel?: boolean;
  onZoom: (event: ZoomEvent) => void;
  onZoomEnd: () => void;

    */


  onWheel(event: WheelEvent) {
    event.preventDefault()
    const { minZoom, maxZoom } = this.props
    let { scale, offsetX, offsetY, scaleFactor } = this.props

    // Keep the previous zoom value
    const prevZoom = scale

    // Determine if we are increasing or decreasing the zoom
    const increaseZoom = event.deltaY < 0

    // Set the new zoom value
    if (increaseZoom) {
      scale = (scale + scaleFactor < maxZoom ? scale + scaleFactor : maxZoom)
    } else {
      scale = (scale - scaleFactor > minZoom ? scale - scaleFactor : minZoom)
    }

    /*
    if (scale <= 1) {
      scale = 1;
    }

    if (scale >= 10) {
      scale = 10;
    }
    */

    if (scale !== prevZoom) {
      if (scale !== minZoom) {
        [ offsetX, offsetY ] = this.getNewPosition(event.pageX, event.pageY, scale)
      } else {
        // Reset to original position
        [ offsetX, offsetY ] = [0, 0]
        // [ offsetX, offsetY ] = [this.constructor.defaultState.posX, this.constructor.defaultState.posY]
      }
    }

    // offsetX = Math.min(offsetX, 0);
    // offsetY = Math.min(offsetY, 0);

    console.log('here', scale, offsetX, offsetY);


    /*
    if (isNaN(offsetX)) {
      offsetX = 0;
    }

    if (isNaN(offsetY)) {
      offsetY = 0;
    }
    */

    // const newScale = between(minZoom, maxZoom, scale);

    this.props.onZoom({
      scale,
      offsetY,
      offsetX
    })

    // this.setState({ zoom, posX, posY, transitionDuration: 0.05 })
  }

  getNewPosition(x, y, zoom) {
    const [prevZoom, prevPosX, prevPosY] = [this.props.scale, this.props.offsetX, this.props.offsetY]

    if (zoom === 1) {
      return [0, 0]
    }

    if (zoom > prevZoom) {
      // Get container coordinates
      const rect = this.childRef.current.getBoundingClientRect()

      // Retrieve rectangle dimensions and mouse position
      const [centerX, centerY] = [rect.width / 2, rect.height / 2]
      const [relativeX, relativeY] = [x - rect.left, y - rect.top]

      // If we are zooming down, we must try to center to mouse position
      const [absX, absY] = [(centerX - relativeX) / prevZoom, (centerY - relativeY) / prevZoom]
      const ratio = zoom - prevZoom
      return [
        prevPosX + (absX * ratio),
        prevPosY + (absY * ratio)
      ]
    } else {
      // If we are zooming down, we shall re-center the element
      return [
        (prevPosX * (zoom - 1)) / (prevZoom - 1),
        (prevPosY * (zoom - 1)) / (prevZoom - 1)
      ]
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
