import posed from 'react-pose';
import { transition } from '../../common/utils/animations';

export const PosedRadialBar = posed.path({
  enter: {
    d: ({ enterProps }) => enterProps.d,
    delay: ({ animated, index, barCount }) => animated ? (index / barCount) * 500 : 0,
    transition: ({ animated }) => (animated ? transition : { duration: 0 })
  },
  exit: {
    d: ({ exitProps }) => exitProps.d
  }
});
