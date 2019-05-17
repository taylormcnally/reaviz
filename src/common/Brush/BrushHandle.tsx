import React, { Component } from 'react';
import bind from 'memoize-bind';
import classNames from 'classnames';
import { range } from 'd3-array';
import * as css from './BrushHandle.module.scss';
import { toggleTextSelection } from '../utils/selection';

interface BrushHandleProps {
  height: number;
  onHandleDrag: (deltaX: number) => void;
}

interface BrushHandleState {
  isDragging: boolean;
}

export class BrushHandle extends Component<BrushHandleProps, BrushHandleState> {
  state: BrushHandleState = {
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

    this.setState({
      isDragging: true
    });

    // Always bind event so we cancel movement even if no action was taken
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event) => {
    if (!this.state.isDragging) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    toggleTextSelection(false);
    document.body.style['cursor'] = 'ew-resize';

    this.props.onHandleDrag(event.movementX);
  };

  onMouseUp = () => {
    this.disposeHandlers();

    this.setState({
      isDragging: false
    });
  };

  render() {
    const { height } = this.props;
    const { isDragging } = this.state;

    return (
      <g
        onMouseDown={bind(this.onMouseDown, this)}
      >
        <line className={css.line} y1="0" y2={height} x1="5" x2="5" />
        <rect
          className={classNames(css.handle, { [css.dragging]: isDragging })}
          height={height - 10}
          style={{ cursor: 'ew-resize' }}
          width={8}
          y="5"
          y1={height - 5}
        />
        <g
          transform={`translate(-1, ${height / 2 - 10})`}
          style={{ pointerEvents: 'none' }}
        >
          {range(5).map(i => (
            <circle cy={i * 5} cx="5" r=".5" key={i} className={css.dot} />
          ))}
        </g>
      </g>
    );
  }
}
