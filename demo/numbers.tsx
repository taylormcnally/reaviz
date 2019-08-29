import { range } from 'd3-array';
import { randomNumber } from './utils';

export const numberData = range(50)
  .filter(() => randomNumber(1, 2) % 2)
  .map(i => ({
    key: randomNumber(i - 5, i + 5),
    data: randomNumber(1, 10)
  }))
  .sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));

export const browserData = [
  { key: 'Chrome', data: 39360 },
  { key: 'Firefox', data: 2228 },
  { key: 'Internet Explorer', data: 100 },
  { key: 'Safari', data: 91 },
  { key: 'Microsoft Edge', data: 2636 }
];
