import posed from 'react-pose';
import { transition } from '../common/utils/animations';

export const PosedCell = posed.rect({
  enter: {
    opacity: 1,
    delay: ({ animated, index }) => (animated ? index * 10 : 0),
    transition: ({ animated }) => (animated ? transition : { duration: 0 })
  },
  exit: {
    opacity: 0
  }
});
