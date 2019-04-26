import { scaleLinear } from 'd3-scale';

/**
 * Get the Y Scale for a given set of radiuses.
 * Reference: https://github.com/d3/d3-scale/issues/90
 */
export const getRadialYScale = (
  innerRadius: number,
  outerRadius: number,
  domain: any[]
) => {
  const y = scaleLinear()
    .range([innerRadius * innerRadius, outerRadius * outerRadius])
    .domain(domain);

  const yScale = Object.assign(d => Math.sqrt(y(d)), y);

  return yScale;
};
