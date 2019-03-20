import posed from 'react-pose';
import { spring } from 'popmotion';
import { interpolate } from 'd3-interpolate';

export const VELOCITY = 10;
export const DAMPING = 100;

// https://github.com/Popmotion/popmotion/issues/645
export const pathTransition = ({ from, to }) =>
  spring({
    from: 0,
    to: 1,
    velocity: VELOCITY,
    damping: DAMPING
  }).pipe(interpolate(from, to));

export const transition = {
  opacity: {
    type: 'tween',
    ease: 'linear',
    duration: 1000
  },
  strokeDasharray: {
    type: 'tween',
    duration: 500
  },
  d: pathTransition,
  default: {
    type: 'spring',
    velocity: VELOCITY,
    damping: DAMPING
  }
};

export const PoseSVGGElement = posed.g({});

export const PosedGroupTransform = posed.g({
  enter: {
    opacity: 1,
    transform: ({ enterProps }) => enterProps.transform,
    delay: ({ animated, index }) => (animated ? index * 10 : 0),
    transition: ({ animated }) => (animated ? transition : { duration: 0 })
  },
  exit: {
    opacity: 0,
    transform: ({ exitProps }) => exitProps.transform
  }
});
