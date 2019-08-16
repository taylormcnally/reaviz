import { scaleOrdinal } from 'd3-scale';
import { maxIndex } from 'd3-array';

export const sequentialScheme = ['#3ec4e8'];

/**
 * Get a color given a range.
 */
export const getColor = (colorScheme: string[], data: any[], attr = 'key', isMultiSeries = false) => {
  if(isMultiSeries) {
    const maxIdx = maxIndex(data, d => d.data.length);
    const maxVal = data[maxIdx];
    data = maxVal.data;
  }

  const dataRange = data.map((r, i) => {
    if (r && r[attr] !== undefined) {
      return r[attr];
    }

    return i;
  });

  return scaleOrdinal(colorScheme).domain(dataRange);
};
