import { Component, createRef, Children, cloneElement } from 'react';
import { toggleTextSelection } from '../utils/selection';
import { smoothMatrix, transform, translate } from 'transformation-matrix';
import { constrainMatrix } from '../utils/position';
import { value, decay, ValueReaction, ColdSubscription } from 'popmotion';
import { clamp } from '@popmotion/popcorn';

interface PanProps {
  disabled: boolean;
  threshold: number;
  cursor?: string;
  x: number;
  y: number;
  scale: number;
  matrix: any;
  width: number;
  height: number;
  constrain: boolean;
  decay: boolean;
  globalPanning: boolean;
  onPanStart: (event: PanStartEvent) => void;
  onPanMove: (event: PanMoveEvent) => void;
  onPanEnd: (event: PanEndEvent) => void;
  onPanCancel: (event: PanCancelEvent) => void;
}

export interface PanStartEvent {
  source: 'mouse' | 'touch';
  nativeEvent: MouseEvent | TouchEvent;
}

export interface PanMoveEvent {
  source: 'mouse' | 'touch';
  x: number;
  y: number;
  nativeEvent: MouseEvent | TouchEvent;
}

export interface PanEndEvent {
  source: 'mouse' | 'touch';
  nativeEvent: MouseEvent | TouchEvent;
}

export interface PanCancelEvent {
  source: 'mouse' | 'touch';
  nativeEvent: MouseEvent | TouchEvent;
}

export class Pan extends Component<PanProps> {
  static defaultProps: Partial<PanProps> = {
    x: 0,
    y: 0,
    disabled: false,
    scale: 1,
    threshold: 10,
    decay: true,
    globalPanning: true,
    onPanStart: () => undefined,
    onPanMove: () => undefined,
    onPanEnd: () => undefined,
    onPanCancel: () => undefined
  };

  prevXPosition: number = 0;
  prevYPosition: number = 0;
  started: boolean = false;
  deltaX: number = 0;
  deltaY: number = 0;
  observer?: ValueReaction;
  decay?: ColdSubscription;
  childRef = createRef<SVGGElement>();
  rqf: any;

  componentDidMount() {
    if (!this.props.disabled && this.childRef.current) {
      this.childRef.current.addEventListener('mousedown', this.onMouseDown, {
        passive: false
      });
      this.childRef.current.addEventListener('touchstart', this.onTouchStart, {
        passive: false
      });
    }
  }

  componentWillUnmount() {
    this.stopDecay();
    this.disposeHandlers();
    cancelAnimationFrame(this.rqf);

    if (this.childRef.current) {
      this.childRef.current.removeEventListener('mousedown', this.onMouseDown);
      this.childRef.current.removeEventListener(
        'touchstart',
        this.onTouchStart
      );
    }
  }

  disposeHandlers() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

    // Reset cursor on body back to original
    document.body.style['cursor'] = 'inherit';
    toggleTextSelection(true);
  }

  checkThreshold() {
    const { threshold } = this.props;
    return (
      !this.started &&
      (Math.abs(this.deltaX) > threshold || Math.abs(this.deltaY) > threshold)
    );
  }

  stopDecay() {
    if (this.decay && this.decay.stop) {
      this.decay.stop();
    }

    if (this.observer) {
      this.observer.complete();
    }
  }

  onPanStart(nativeEvent, source: 'mouse' | 'touch') {
    const { x, y } = this.props;
    this.observer = value({ x, y });

    this.props.onPanStart({
      nativeEvent,
      source
    });
  }

  onPanMove(x: number, y: number, source: 'mouse' | 'touch', nativeEvent) {
    this.observer && this.observer.update({ x, y });

    this.props.onPanMove({
      source,
      nativeEvent,
      x,
      y
    });
  }

  onPanEnd(nativeEvent, source: 'mouse' | 'touch') {
    const {
      width,
      height,
      matrix,
      constrain,
      onPanEnd,
      onPanMove
    } = this.props;

    if (this.observer && this.props.decay) {
      // Calculate the end matrix
      const endX = width * matrix.a - width;
      const endY = height * matrix.a - height;

      this.decay = decay({
        from: this.observer.get(),
        velocity: this.observer.getVelocity()
      })
        .pipe(res => ({
          x: constrain ? clamp(-endX, 0)(res.x) : res.x,
          y: constrain ? clamp(-endY, 0)(res.y) : res.y
        }))
        .start({
          update: ({ x, y }) => {
            this.rqf = requestAnimationFrame(() => {
              onPanMove({
                source: 'touch',
                nativeEvent,
                x,
                y
              });
            });
          },
          complete: () => {
            onPanEnd({
              nativeEvent,
              source
            });
          }
        });
    } else {
      onPanEnd({
        nativeEvent,
        source
      });
    }
  }

  pan(x: number, y: number, nativeEvent, source: 'mouse' | 'touch') {
    const { scale, constrain, width, height, matrix } = this.props;

    const newMatrix = smoothMatrix(
      transform(matrix, translate(x / scale, y / scale)),
      100
    );

    const shouldConstrain =
      constrain && constrainMatrix(height, width, newMatrix);
    if (!shouldConstrain) {
      this.onPanMove(newMatrix.e, newMatrix.f, source, nativeEvent);
    }

    return shouldConstrain;
  }

  onMouseDown = (event: MouseEvent) => {
    // Ignore right click
    if (event.which === 3) {
      return;
    }

    // If global panning is turned off, it will only pan on the container
    if (
      !this.props.globalPanning &&
      event.srcElement !== this.childRef.current
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.stopDecay();
    toggleTextSelection(false);
    this.started = false;

    // Always bind event so we cancel movement even if no action was taken
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  };

  onMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    this.deltaX = this.deltaX + event.movementX;
    this.deltaY = this.deltaY + event.movementY;

    if (this.checkThreshold()) {
      if (this.props.cursor) {
        document.body.style['cursor'] = this.props.cursor;
      }

      this.deltaX = 0;
      this.deltaY = 0;
      this.started = true;

      this.onPanStart(event, 'mouse');
    } else {
      this.pan(event.movementX, event.movementY, event, 'mouse');
    }
  };

  onMouseUp = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    this.disposeHandlers();
    toggleTextSelection(true);

    if (this.started) {
      this.onPanEnd(event, 'mouse');
    } else {
      this.props.onPanCancel({
        nativeEvent: event,
        source: 'mouse'
      });
    }
  };

  onTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.stopDecay();
    toggleTextSelection(false);
    this.started = false;

    this.prevXPosition = event.touches[0].clientX;
    this.prevYPosition = event.touches[0].clientY;

    // Always bind event so we cancel movement even if no action was taken
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);
  };

  onTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // Calculate delta from previous position and current
    const x = event.touches[0].clientX;
    const y = event.touches[0].clientY;

    const deltaX = x - this.prevXPosition;
    const deltaY = y - this.prevYPosition;

    this.deltaX = this.deltaX + deltaX;
    this.deltaY = this.deltaY + deltaY;

    if (this.checkThreshold()) {
      this.deltaX = 0;
      this.deltaY = 0;
      this.started = true;

      this.onPanStart(event, 'touch');
    } else {
      const contrained = this.pan(deltaX, deltaY, event, 'touch');

      if (!contrained) {
        this.prevXPosition = x;
        this.prevYPosition = y;
      }
    }
  };

  onTouchEnd = (event: TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();

    this.disposeHandlers();
    toggleTextSelection(true);

    if (this.started) {
      this.onPanEnd(event, 'touch');
    } else {
      this.props.onPanCancel({
        nativeEvent: event,
        source: 'touch'
      });
    }
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
