import { bisector } from 'd3-array';

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
 * Given an event, get the relative X/Y position for a target.
 */
export function getPositionForTarget({ target, clientX, clientY }) {
  // calculate coordinates from svg
  if (target.createSVGPoint) {
    let point = target.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    point = point.matrixTransform(target.getScreenCTM().inverse());

    return {
      x: point.x,
      y: point.y
    };
  }

  // fallback to calculating position from non-svg dom node
  const rect = target.getBoundingClientRect();
  return {
    x: clientX - rect.left - target.clientLeft,
    y: clientY - rect.top - target.clientTop
  };
}

/**
 * Given an event, get the parent svg element;
 */
export function getParentSVG(event) {
  // set node to targets owner svg
  let node = event.target.ownerSVGElement;

  // find the outermost svg
  while (node.ownerSVGElement) {
    node = node.ownerSVGElement;
  }

  return node;
}

/**
 * Get the point from a touch event.
 */
export function getPointFromTouch(node, event?) {
  // called with no args
  if (!node) return;

  // called with localPoint(event)
  if (node.target) {
    event = node;
    node = getParentSVG(node);
  }

  return [...event.touches].map(touch => {
    return getPositionForTarget({
      target: node,
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  })
}

/**
 * Get the point given a node.
 */
export function getPointFromMouse(node, event?) {
  // called with no args
  if (!node) return;

  // called with localPoint(event)
  if (node.target) {
    event = node;
    node = getParentSVG(node);
  }

  // default to mouse event
  const { clientX, clientY } = event;

  return getPositionForTarget({
    target: node,
    clientX,
    clientY
  });
}
