import posed from 'react-pose';
import { transition } from '../../common/utils/animations';

export const PosedRadialArea = posed.path({
  enter: {
    d: ({ enterProps }) => enterProps.d,
    delay: ({ animated }) => animated ? 10 : 0,
    transition: ({ animated }) => (animated ? transition : { duration: 0 })
  },
  exit: {
    d: ({ exitProps }) => exitProps.d
  }
});

