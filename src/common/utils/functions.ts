import { isFunction } from 'lodash-es';
import classNames from 'classnames';

export type PropFunctionTypes = {
  className?: any;
  style?: any;
};

export const functionProps = (prop: string, val: any, data: any) => {
  if (isFunction(val)) {
    return val(data);
  } else if (prop === 'className') {
    return classNames(val);
  } else if (val !== undefined || val !== null) {
    return val;
  }

  return {};
};

export const constructFunctionProps = (
  props: PropFunctionTypes,
  data: any
) => ({
  className: functionProps('className', props.className, data),
  style: functionProps('style', props.style, data)
});
