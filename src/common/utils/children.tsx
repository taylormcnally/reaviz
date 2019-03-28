import { cloneElement, PureComponent } from 'react';
import { isFunction, memoize } from 'lodash-es';
import classNames from 'classnames';

interface CloneElementProps {
  element: any | null;
}

/**
 * CloneElement is a wrapper component for createElement function.
 * This allows you to describe your cloning element declaratively
 * which is a more natural API for React.
 */
export class CloneElement<T = any> extends PureComponent<
  CloneElementProps & Partial<T>
> {
  getProjectedProps = memoize(props => {
    const childProps = this.props.element.props;

    return Object.keys(props).reduce((acc, key) => {
      const prop = props[key];
      const childProp = childProps[key];

      if (isFunction(prop) && isFunction(childProp)) {
        acc[key] = args => {
          prop(args);
          childProp(args);
        };
      } else if (key === 'className') {
        acc[key] = classNames(prop, childProp);
      } else {
        acc[key] = prop;
      }

      return acc;
    }, {});
  });

  render() {
    const { element, children, ...rest } = this.props;

    if (element === null) {
      return children;
    }

    const newProps = this.getProjectedProps(rest);
    return cloneElement(element, {
      ...element.props,
      ...newProps,
      children
    });
  }
}
