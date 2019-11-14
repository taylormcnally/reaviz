import {
  cloneElement,
  useMemo,
  ReactNode
} from 'react';
import classNames from 'classnames';

interface CloneElementProps {
  element: any | null;
  children?: ReactNode;
}

/**
 * CloneElement is a wrapper component for createElement function.
 * This allows you to describe your cloning element declaratively
 * which is a more natural API for React.
 */
export function CloneElement<T = any>({ children, element, ...rest }: CloneElementProps & Partial<T> & { ref?: any }) {
  const getProjectedProps = useMemo(
    () => props => {
      const childProps = element.props;

      return Object.keys(props).reduce((acc, key) => {
        const prop = props[key];
        const childProp = childProps[key];

        if (typeof prop === 'function' && typeof childProp === 'function') {
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
    },
    [rest]
  );

  if (element === null) {
    return children;
  }

  const newProps = getProjectedProps(rest);
  return cloneElement(element, {
    ...element.props,
    ...newProps,
    children,
    ref: node => {
      const { ref } = element
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node;
      }
    }
  });
}
