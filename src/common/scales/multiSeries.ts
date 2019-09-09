import { scaleBand } from 'd3-scale';
import { getGroupDomain, getDeepGroupDomain } from '../utils/domains';

/**
 * Get the group scale aka x0.
 */
export function getGroupScale({
  dimension,
  padding,
  data,
  direction = 'vertical'
}) {
  const domain = getGroupDomain(data, 'key');
  const spacing = domain.length / (dimension / padding + 1);
  const range = direction === 'vertical' ? [0, dimension] : [dimension, 0];

  return scaleBand()
    .rangeRound(range as any)
    .paddingInner(spacing)
    .paddingOuter(spacing / 2)
    .domain(domain as string[]);
}

/**
 * Get the inner scale aka x1.
 */
export function getInnerScale({ groupScale, padding, data, prop = 'x' }) {
  const dimension = groupScale.bandwidth();
  const domain = getDeepGroupDomain(data, prop);
  const spacing = domain.length / (dimension / padding + 1);

  return scaleBand()
    .rangeRound([0, dimension])
    .paddingInner(spacing)
    .domain(domain as string[]);
}
