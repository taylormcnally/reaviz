import { cloneElement, useMemo, forwardRef, Ref } from 'react';
import classNames from 'classnames';

interface CloneElementProps {
  element: any | null;
  children?: any;
}

/**
 * CloneElement is a wrapper component for createElement function.
 * This allows you to describe your cloning element declaratively
 * which is a more natural API for React.
 *
 * Note: I also give up on making TS happy w/ this stupid const generic
 */
// @ts-ignore
export const CloneElement = <T>(
  forwardRef(
    (
      { element, children, ...rest }: CloneElementProps & any,
      ref: Ref<unknown>
    ) => {
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
        ref,
        ...element.props,
        ...newProps,
        children
      });
    }
  )
);
