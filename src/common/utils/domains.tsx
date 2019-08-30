import { min, max } from 'd3-array';
import { isNumber } from 'lodash-es';

/**
 * Gets the min/max values handling nested arrays.
 */
export function extent(data: any[], attr: string): number[] {
  const accessor = (val, fn) => {
    if (Array.isArray(val.data)) {
      return fn(val.data, vv => vv[attr]);
    }
    return val[attr];
  };

  const minVal = min(data, d => accessor(d, min));
  const maxVal = max(data, d => accessor(d, max));

  return [minVal, maxVal];
}

/**
 * Get the domain for the Y Axis.
 */
export function getYDomain({ scaled, data }): number[] {
  const [startY, endY] = extent(data, 'y');
  const [startY1, endY1] = extent(data, 'y1');

  // If dealing w/ negative numbers, we should
  // normalize the top and bottom values
  if (startY < 0) {
    const posStart = -startY;
    const maxNum = Math.max(posStart, endY);

    return [
      -maxNum,
      maxNum
    ];
  }

  // Scaled start scale at non-zero
  if (scaled) {
    return [startY1, endY1];
  }

  // Start at 0 based
  return [0, endY1];
}

/**
 * Get the domain for the X Axis.
 */
export function getXDomain({ data, scaled = false }): number[] {
  const [min, max] = extent(data, 'x');

  // For linear X based scales, we should set min to 0
  if (isNumber(min) && isNumber(max) && !scaled) {
    return [0, max];
  }

  return [min, max];
}

/**
 * Returns a unique group domain.
 */
export function getGroupDomain(data: any[], attr: string): string[] {
  return data.reduce((acc, cur) => {
    const val = cur[attr];

    if (acc.indexOf(val) === -1) {
      acc.push(val);
    }

    return acc;
  }, []);
}

/**
 * Get a deeply nested group domain.
 */
export function getDeepGroupDomain(data: any[], attr: string): string[] {
  return data.reduce((acc, cur) => {
    const filtered = getGroupDomain(cur.data, attr).filter(
      d => acc.indexOf(d) === -1
    );
    acc.push(...filtered);
    return acc;
  }, []);
}
