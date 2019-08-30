import { bisector } from 'd3-array';
import { applyToPoint, inverse, applyToPoints } from 'transformation-matrix';

/**
 * Given a point position, get the closes data point in the dataset.
 */
export function getClosestPoint(pos: number, scale, data, attr = 'x') {
  const domain = scale.invert(pos);

  // Select the index
  const bisect = bisector((d: any) => d[attr]).right;
  const index = bisect(data, domain);

  // Determine min index
  const minIndex = Math.max(0, index - 1);
  const before = data[minIndex];

  // Determine max index
  const maxIndex = Math.min(data.length - 1, index);
  const after = data[maxIndex];

  // Determine which is closest to the point
  let beforeVal = before[attr];
  let afterVal = after[attr];
  beforeVal = domain - beforeVal;
  afterVal = afterVal - domain;

  return beforeVal < afterVal ? before : after;
}

/**
 * Given an event, get the parent svg element;
 */
export function getParentSVG(event) {
  // set node to targets owner svg
  let node = event.target.ownerSVGElement;

  // find the outermost svg
  if (node) {
    while (node.ownerSVGElement) {
      node = node.ownerSVGElement;
    }
  }

  return node;
}

/**
 * Given an event, get the relative X/Y position for a target.
 */
export function getPositionForTarget({ target, clientX, clientY }) {
  const { top, left } = target.getBoundingClientRect();
  return {
    x: clientX - left - target.clientLeft,
    y: clientY - top - target.clientTop
  };
}

/**
 * Gets the point from q given matrix.
 */
export function getPointFromMatrix(event, matrix) {
  const parent = getParentSVG(event);

  if (!parent) {
    return null;
  }

  // Determines client coordinates relative to the editor component
  const { top, left } = parent.getBoundingClientRect();
  const x = event.clientX - left;
  const y = event.clientY - top;

  // Transforms the coordinate to world coordinate (in the SVG/DIV world)
  return applyToPoint(inverse(matrix), { x, y });
}

/**
 * Get the start/end matrix.
 */
export function getLimitMatrix(height: number, width: number, matrix) {
  return applyToPoints(matrix, [{ x: 0, y: 0 }, { x: width, y: height }]);
}

/**
 * Constrain the matrix.
 */
export function constrainMatrix(height: number, width: number, matrix) {
  const [min, max] = getLimitMatrix(height, width, matrix);

  if (max.x < width || max.y < height) {
    return true;
  }

  if (min.x > 0 || min.y > 0) {
    return true;
  }

  return false;
}

/**
 * Determine if scale factor is less than allowed.
 */
function lessThanScaleFactorMin(value, scaleFactor: number) {
  return value.scaleFactorMin && value.d * scaleFactor <= value.scaleFactorMin;
}

/**
 * Determine if scale factor is larger than allowed.
 */
function moreThanScaleFactorMax(value, scaleFactor: number) {
  return value.scaleFactorMax && value.d * scaleFactor >= value.scaleFactorMax;
}

/**
 * Determine if both min and max scale fctors are going out of bounds.
 */
export function isZoomLevelGoingOutOfBounds(value, scaleFactor: number) {
  const a = lessThanScaleFactorMin(value, scaleFactor) && scaleFactor < 1;
  const b = moreThanScaleFactorMax(value, scaleFactor) && scaleFactor > 1;
  return a || b;
}
