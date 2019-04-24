import posed from 'react-pose';
import {
  transition,
  VELOCITY,
  DAMPING
} from '../../common/utils/animations';
import { spring } from 'popmotion';
import { interpolate } from 'd3-interpolate';

const pathTransition = props => {
  const from = props.previousEnter ? props.previousEnter.y : props.from.y;
  const interpolater = interpolate(from, props.to.y);

  return spring({
    from: 0,
    to: 1,
    velocity: VELOCITY,
    damping: DAMPING
  }).pipe(t => props.getArc({ ...props.to, y: interpolater(t) }));
};

const newTransition = {
  ...transition,
  d: pathTransition
};

export const PosedRadialBar = posed.path({
  enter: {
    d: ({ enterProps }) => enterProps,
    delay: ({ animated, index, barCount }) => animated ? (index / barCount) * 500 : 0,
    transition: ({ animated }) => (animated ? newTransition : { duration: 0 })
  },
  exit: {
    d: ({ exitProps }) => exitProps
  }
});
