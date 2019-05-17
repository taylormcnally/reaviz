import React, { Component, Fragment } from 'react';
import bind from 'memoize-bind';
import { getPositionForTarget } from '../utils/position';
import { BrushSlice, BrushChangeEvent } from './BrushSlice';
import { ChartDataTypes } from '../data';
import { toggleTextSelection } from '../utils/selection';

export interface BrushConfiguration {
  disabled?: boolean;
  fill?: string;
  domain?: [ChartDataTypes, ChartDataTypes];
  onBrushChange?: (e) => void;
}

export interface BrushProps {
  height: number;
  width: number;
  disabled?: boolean;
  start?: number;
  end?: number;
  onBrushChange?: (e: BrushChangeEvent) => void;
}

interface BrushState {
  isSlicing: boolean;
  isPanning: boolean;
  start?: number;
  end?: number;
  initial?: number;
}

export class Brush extends Component<BrushProps, BrushState> {
  static defaultProps: Partial<BrushProps> = {
    disabled: false,
    height: 0,
    width: 0,
    onBrushChange: () => undefined
  };

  ref: any;
  moved = false;

  constructor(props: BrushProps) {
    super(props);

    this.state = {
      isSlicing: false,
      isPanning: false,
      start: props.start || 0,
      end: props.end || props.width
    };
  }

  componentDidUpdate(prevProps: BrushProps) {
    // If no brush is defined and width updates, update the offset of the end handle.
    if (
      prevProps.width !== this.props.width &&
      this.state.end === prevProps.width
    ) {
      this.setState({ end: this.props.width });
    }

    // Don't update if we are doing the slicing
    if (!this.state.isSlicing && !this.state.isPanning) {
      const { start, end } = this.props;
      const startUpdated =
        start !== prevProps.start && start !== this.state.start;
      const endUpdated = end !== prevProps.end && end !== this.state.end;

      if (startUpdated || endUpdated) {
        this.setState({
          ...this.ensurePositionInBounds(start, end)
        });
      }
    }
  }

  componentWillUnmount() {
    this.disposeHandlers();
  }

  disposeHandlers() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);

    // Reset cursor on body back to original
    document.body.style['cursor'] = 'inherit';
    toggleTextSelection(true);
  }

  getStartEnd(event: MouseEvent, state: BrushState = this.state) {
    const { x } = this.getPositionsForPanEvent(event);

    let start;
    let end;
    if (x < state.initial!) {
      start = x;
      end = state.initial;
    } else {
      start = state.initial;
      end = x;
    }

    return this.ensurePositionInBounds(start, end, state);
  }

  getPositionsForPanEvent(event: MouseEvent) {
    const eventObj = {
      target: this.ref,
      clientX: event.clientX,
      clientY: event.clientY
    };

    return getPositionForTarget(eventObj);
  }

  ensurePositionInBounds(
    newStart?: number,
    newEnd?: number,
    state: BrushState = this.state
  ) {
    const { width } = this.props;
    let start = newStart;
    let end = newEnd;

    if (start === undefined || start <= 0) {
      start = 0;
    }

    if (end === undefined) {
      end = width;
    }

    if (start > end) {
      start = state.start!;
    }

    if (end < start) {
      end = state.end!;
    }

    if (end >= width) {
      end = width;
    }

    return { start, end };
  }

  onMouseDown(event: React.MouseEvent) {
    // Ignore right click
    if (event.nativeEvent.which === 3 || this.props.disabled) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    const positions = this.getPositionsForPanEvent(event.nativeEvent);
    this.moved = false;

    this.setState({
      isSlicing: true,
      initial: positions.x
    });

    // Always bind event so we cancel movement even if no action was taken
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event) => {
    if (!this.state.isSlicing) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    toggleTextSelection(false);
    document.body.style['cursor'] = 'crosshair';
    this.moved = true;

    this.setState(prev => {
      const { onBrushChange } = this.props;

      // Use setState callback so we can get the true previous value
      // rather than the bulk updated value react will trigger
      const { start, end } = this.getStartEnd(event, prev);

      if (onBrushChange) {
        onBrushChange({
          start,
          end
        });
      }

      return {
        start,
        end
      };
    });
  };

  onMouseUp = () => {
    this.disposeHandlers();

    if (!this.moved) {
      this.onCancel();
    }

    this.moved = false;

    this.setState({
      isSlicing: false
    });
  };

  onCancel() {
    const val = {
      start: 0,
      end: this.props.width
    };

    this.setState(val);

    if (this.props.onBrushChange) {
      this.props.onBrushChange(val);
    }
  }

  onSliceChange(event: BrushChangeEvent) {
    const val = this.ensurePositionInBounds(event.start, event.end);

    this.setState(val);

    if (this.props.onBrushChange) {
      this.props.onBrushChange(val);
    }
  }

  render() {
    const { children, disabled, height, width } = this.props;
    const { isSlicing, start, end } = this.state;

    return (
      <g
        onMouseDown={bind(this.onMouseDown, this)}
        style={{
          pointerEvents: isSlicing ? 'none' : 'auto',
          cursor: disabled ? '' : 'crosshair'
        }}
      >
        {children}
        {!disabled && (
          <Fragment>
            <rect
              ref={ref => (this.ref = ref)}
              height={height}
              width={width}
              opacity={0}
            />
            {start !== undefined && end !== undefined && (
              <BrushSlice
                start={start}
                end={end}
                height={height}
                width={width}
                onBrushChange={bind(this.onSliceChange, this)}
              />
            )}
          </Fragment>
        )}
      </g>
    );
  }
}
