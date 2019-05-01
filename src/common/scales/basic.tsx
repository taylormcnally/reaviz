import {
  scaleLinear,
  scaleTime,
  scaleBand,
  ScaleBand,
  ScalePoint,
  ScaleTime,
  ScaleLinear
} from 'd3-scale';
import { getXDomain, getYDomain, getGroupDomain } from '../utils/domains';
import {
  ChartInternalShallowDataShape,
  ChartInternalNestedDataShape
} from '../data';

interface ScaleConfig {
  type: 'category' | 'value' | 'time' | 'duration';
  roundDomains: boolean;
  data: any[];
  domain?: any[];
  padding?: number;
  scaled?: boolean;
  width?: number;
  height?: number;
  isMultiSeries?: boolean;
}

/**
 * Gets the X Scale function.
 */
export function getXScale({
  type,
  roundDomains,
  data,
  width,
  domain,
  padding,
  scaled,
  isMultiSeries = false
}: ScaleConfig): ScalePoint<any> | ScaleBand<any> | ScaleTime<any, any> {
  let scale;

  if (type === 'time' || type === 'duration' || type === 'value') {
    if (type === 'time') {
      scale = scaleTime().rangeRound([0, width!]);
    } else {
      scale = scaleLinear().rangeRound([0, width!]);
    }

    domain = domain || getXDomain({ data, scaled });
    scale = scale.domain(domain);
  } else if (type === 'category') {
    if (!domain) {
      if (isMultiSeries) {
        domain = getGroupDomain(data as ChartInternalNestedDataShape[], 'key');
      } else {
        domain = getGroupDomain(data as ChartInternalShallowDataShape[], 'x');
      }
    }

    scale = scaleBand()
      .rangeRound([0, width!])
      .padding(padding || 0)
      .domain(domain);
  }

  return roundDomains ? scale.nice() : scale;
}

/**
 * Gets the Y Scale function.
 */
export function getYScale({
  type,
  roundDomains,
  height,
  data,
  domain,
  scaled,
  padding,
  isMultiSeries = false
}: ScaleConfig): ScaleLinear<any, any> {
  let scale;
  if (type === 'time' || type === 'value' || type === 'duration') {
    scale = scaleLinear()
      .range([height!, 0])
      .domain(domain || getYDomain({ scaled, data }));
  } else {
    if (!domain) {
      if (isMultiSeries) {
        domain = getGroupDomain(data as ChartInternalNestedDataShape[], 'key');
      } else {
        domain = getGroupDomain(data as ChartInternalShallowDataShape[], 'y');
      }
    }

    scale = scaleBand()
      .rangeRound([height!, 0])
      .padding(padding || 0)
      .domain(domain);
  }

  return roundDomains ? scale.nice() : scale;
}
