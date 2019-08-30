import { median } from 'd3-array';
import {
  ChartInternalNestedDataShape,
  ChartShallowDataShape,
  ChartNestedDataShape,
  ChartInternalShallowDataShape
} from './types';
import {
  getMaxBigIntegerForNested,
  getMaxBigIntegerForShallow,
  normalizeValue,
  normalizeValueForFormatting
} from './bigInteger';

export type Direction = 'vertical' | 'horizontal';

/**
 * Accepts a `ChartDataShape` and transforms it to a chart readable data shape.
 *
 * Example:
 *
 *   [{
 *    key: 'Threat Intel',
 *    data: [{ key:'2011', data: 25 }]
 *   }]
 *
 * will be transformed to:
 *
 *  [{
 *    key: 'Threat Intel',
 *    data: [
 *      key: 'Threat Intel',
 *      x: '2011',
 *      y: 25
 *    ]
 *  }]
 */
export function buildNestedChartData(
  series: ChartNestedDataShape[],
  sort = false,
  direction: Direction = 'vertical'
): ChartInternalNestedDataShape[] {
  let result: ChartInternalNestedDataShape[] = [];
  const maxBigInteger = getMaxBigIntegerForNested(series);
  const isVertical = direction === 'vertical';

  for (const point of series) {
    for (const nestedPoint of point.data) {
      const key = normalizeValueForFormatting(point.key);
      let idx = result.findIndex(r => {
        const left = r.key;
        if (left instanceof Date && key instanceof Date) {
          return left.getTime() === key.getTime();
        }
        return left === key;
      });

      if (idx === -1) {
        result.push({
          key,
          data: []
        });

        idx = result.length - 1;
      }

      const x = normalizeValue(
        isVertical ? nestedPoint.key : nestedPoint.data,
        maxBigInteger
      );

      const y = normalizeValue(
        isVertical ? nestedPoint.data : nestedPoint.key,
        maxBigInteger
      );

      result[idx].data.push({
        key,
        value: normalizeValueForFormatting(nestedPoint.data),
        meta: point.meta,
        id: point.id,
        x,
        x0: isVertical ? x : 0,
        x1: x,
        y,
        y0: isVertical ? 0 : y,
        y1: y
      });
    }
  }

  // Sort the series data based on the median value
  if (sort) {
    result = result.sort((a, b) => {
      const aMax = median(a.data, (d: any) => d.y)!;
      const bMax = median(b.data, (d: any) => d.y)!;
      return aMax < bMax ? 1 : -1;
    });
  }

  return result;
}

/**
 * Accepts a shallow shape and normalizes it to a chart readable format.
 */
export function buildShallowChartData(
  series: ChartShallowDataShape[],
  direction: Direction = 'vertical'
): ChartInternalShallowDataShape[] {
  const result: ChartInternalShallowDataShape[] = [];
  const maxBigInteger = getMaxBigIntegerForShallow(series);
  const isVertical = direction === 'vertical';

  for (const point of series) {
    const isTuple = Array.isArray(point.data);

    const props = {
      k0: normalizeValue(isVertical ? 0 : point.key, maxBigInteger),
      k1: normalizeValue(point.key, maxBigInteger),
      v0: normalizeValue(isTuple ? point.data[0] : 0, maxBigInteger),
      v1: normalizeValue(isTuple ? point.data[1] : point.data, maxBigInteger)
    };

    const xProp = isVertical ? 'k' : 'v';
    const yProp = isVertical ? 'v' : 'k';

    result.push({
      key: normalizeValueForFormatting(props.k1),
      value: normalizeValueForFormatting(props.v1),
      meta: point.meta,
      id: point.id,
      x: props[`${xProp}1`],
      x0: props[`${xProp}0`],
      x1: props[`${xProp}1`],
      y: props[`${yProp}1`],
      y0: props[`${yProp}0`],
      y1: props[`${yProp}1`]
    });
  }

  return result;
}
