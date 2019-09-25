import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { interpolate } from 'd3-interpolate';
import { DEFAULT_TRANSITION } from '../../../common/Motion';

export const MotionArc = ({ custom, transition, arc, ...rest }) => {
  const d = useMotionValue(custom.exit);
  const prevPath = useMotionValue(custom.exit);
  const spring = useSpring(prevPath, {
    ...DEFAULT_TRANSITION,
    from: 0,
    to: 1
  });

  useEffect(() => {
    const from = custom.previousEnter || prevPath.get();
    const interpolator = interpolate(from, custom.enter);
    const unsub = spring.onChange(v => d.set(arc(interpolator(v))));
    prevPath.set(custom.enter);
    return unsub;
  });

  const { d: enterD } = custom.enter;

  return (
    <motion.path
      {...rest}
      transition={transition}
      d={transition.type !== false ? d : enterD}
    />
  );
};
