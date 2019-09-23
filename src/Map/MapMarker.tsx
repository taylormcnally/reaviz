import React, { Component, createRef, Fragment } from 'react';
import { Tooltip } from '../common/Tooltip';
import bind from 'memoize-bind';
import css from './MapMarker.module.scss';
import { motion } from 'framer-motion';

export interface MapMarkerProps {
  coordinates: [number, number];
  cy?: number;
  cx?: number;
  size?: number;
  index?: number;
  tooltip?: any;
  onClick?: () => void;
}

interface MapMarkerState {
  active?: boolean;
}

// Set padding modifier for the tooltips
const modifiers = {
  offset: {
    offset: '0, 3px'
  }
};

export class MapMarker extends Component<MapMarkerProps, MapMarkerState> {
  static defaultProps: Partial<MapMarkerProps> = {
    size: 3,
    onClick: () => undefined
  };

  ref = createRef<SVGCircleElement>();
  state: MapMarkerState = {};

  onMouseEnter() {
    this.setState({ active: true });
  }

  onMouseLeave() {
    this.setState({ active: false });
  }

  render() {
    const { cx, cy, tooltip, size, index, onClick } = this.props;
    const { active } = this.state;

    return (
      <Fragment>
        <motion.circle
          initial={{
            opacity: 0,
            scale: 0.02
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            delay: index * 0.3
          }}
          ref={this.ref}
          className={css.marker}
          cx={cx}
          cy={cy}
          r={size}
          onMouseEnter={bind(this.onMouseEnter, this)}
          onMouseLeave={bind(this.onMouseLeave, this)}
          onClick={onClick}
        />
        {tooltip && (
          <Tooltip
            visible={!!active}
            reference={this.ref}
            modifiers={modifiers}
            content={tooltip}
          />
        )}
      </Fragment>
    );
  }
}
