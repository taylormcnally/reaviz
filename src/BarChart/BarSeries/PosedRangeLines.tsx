import posed from 'react-pose';
import { transition } from '../../common/utils/animations';

export const PosedRangeLine = posed.rect({
  enter: {
    opacity: 1,
    x: ({ enterProps }) => enterProps.x,
    y: ({ enterProps }) => enterProps.y,
    delay: ({ animated, index, barCount, layout }) => {
      if (animated) {
        if (layout === 'vertical') {
          return (index / barCount) * 500;
        } else {
          return ((barCount - index) / barCount) * 500;
        }
      }

      return 0;
    },
    transition: ({ animated }) => (animated ? transition : { duration: 0 })
  },
  exit: {
    opacity: 0,
    x: ({ exitProps }) => exitProps.x,
    y: ({ exitProps }) => exitProps.y
  }
});
