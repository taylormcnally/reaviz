import { scaleOrdinal } from 'd3-scale';
import { range } from 'd3-array';

export const sequentialScheme = ['#3ec4e8'];

/**
 * Get a color given a range.
 */
export function getColor(colorScheme: string[], data: any[]) {
  const isMultiSeries = data[0].hasOwnProperty('data');
  let dataRange;
  if(isMultiSeries) {
    dataRange = range(data[0]['data'].length).map(r => r.toString());
  } else {
    dataRange = range(data.length).map(r => r.toString());
  }
  return scaleOrdinal(colorScheme).domain(dataRange);
}
