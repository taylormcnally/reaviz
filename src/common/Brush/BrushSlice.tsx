import React, { Component, Fragment } from 'react';
import bind from 'memoize-bind';
import { BrushHandle } from './BrushHandle';
import * as css from './BrushSlice.module.scss';
import { toggleTextSelection } from '../utils/selection';

export interface BrushChangeEvent {
  start?: number;
  end?: number;
}

interface BrushSliceProps {
  height: number;
  width: number;
  start: number;
  end: number;
  onBrushChange: (event: BrushChangeEvent) => void;
}

interface BrushSliceState {
  isDragging: boolean;
}

export class BrushSlice extends Component<BrushSliceProps, BrushSliceState> {
  state: BrushSliceState = {
    isDragging: false
  };

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

  onMouseDown(event: React.MouseEvent) {
    // Ignore right click
    if (event.nativeEvent.which === 3) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    const { start, end, width } = this.props;
    const hasNoSlice = start === 0 && end === width;

    if (!hasNoSlice) {
      this.setState({
        isDragging: true
      });

      // Always bind event so we cancel movement even if no action was taken
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
    }
  }

  onMouseMove = (event) => {
    if (!this.state.isDragging) {
      return;
    }

    toggleTextSelection(false);
    document.body.style['cursor'] = 'grabbing';
    event.preventDefault();
    event.stopPropagation();

    const start = this.props.start + event.movementX;
    const end = this.props.end + event.movementX;

    if (start >= 0 && end <= this.props.width) {
      this.props.onBrushChange({
        start,
        end
      });
    }
  };

  onMouseUp = () => {
    this.disposeHandlers();

    this.setState({
      isDragging: false
    });
  };

  onHandleDrag(direction: 'start' | 'end', deltaX: number) {
    const start =
      direction === 'start' ? this.props.start + deltaX : this.props.start;
    const end =
      direction !== 'start' ? this.props.end + deltaX : this.props.end;

    this.props.onBrushChange({
      start,
      end
    });
  }

  render() {
    const { height, start, end, width } = this.props;
    const { isDragging } = this.state;
    const sliceWidth = Math.max(end - start, 0);
    const endSliceWidth = Math.max(width - end, 0);
    const hasNoSlice = start === 0 && end === width;

    return (
      <Fragment>
        <rect className={css.unsliced} height={height} width={start} />
        <rect
          transform={`translate(${end}, 0)`}
          className={css.unsliced}
          height={height}
          width={endSliceWidth}
        />
        <g transform={`translate(${start}, 0)`}>
          <g
            onMouseDown={bind(this.onMouseDown, this)}
          >
            <rect
              className={css.slice}
              height={height}
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                opacity: hasNoSlice ? 0 : 0.1,
                pointerEvents: !hasNoSlice ? 'initial' : 'none'
              }}
              width={sliceWidth}
            />
          </g>
          <g transform={`translate(-4, 0)`}>
            <BrushHandle
              height={height}
              onHandleDrag={bind(this.onHandleDrag, this, 'start')}
            />
          </g>
          <g transform={`translate(${sliceWidth - 5}, 0)`}>
            <BrushHandle
              height={height}
              onHandleDrag={bind(this.onHandleDrag, this, 'end')}
            />
          </g>
        </g>
      </Fragment>
    );
  }
}
