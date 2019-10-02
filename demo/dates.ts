import bigInt from 'big-integer';
import { range } from 'd3-array';
import { generateDate, randomNumber } from './utils';

const generateData = (count, minVal = 1, maxVal = 50) =>
  range(count)
    .map(i => ({
      id: (i + 1).toString(),
      key: generateDate(i),
      data: randomNumber(minVal, maxVal)
    }))
    .reverse();

const DIVERGING_DATA_KEY_POSITIVE = 'Opened';
const DIVERGING_DATA_KEY_NEGATIVE = 'Closed';
const generateBinnedData = (
  count: number,
  minVal = 0,
  maxVal = 50,
  dataKeyToZero = ''
) =>
  range(count)
    .map(i => ({
      key: generateDate(i).toLocaleDateString(),
      data: [
        {
          key: DIVERGING_DATA_KEY_NEGATIVE,
          data:
            dataKeyToZero === DIVERGING_DATA_KEY_NEGATIVE
              ? 0
              : -randomNumber(minVal, maxVal)
        },
        {
          key: DIVERGING_DATA_KEY_POSITIVE,
          data:
            dataKeyToZero === DIVERGING_DATA_KEY_POSITIVE
              ? 0
              : randomNumber(minVal, maxVal)
        }
      ]
    }))
    .reverse();

const dateOffsets = [14, 10, 5, 2];
const generateBaseDateData = (offsets = dateOffsets) =>
  offsets.map(offset => ({ offset, data: randomNumber(0, 20) }));
const generateDateData = (baseData = generateBaseDateData()) =>
  baseData.map((item: any, index: number) => ({
    key: generateDate(item.offset),
    id: index.toString(),
    data: item.data
  }));

export const largeDateData = generateData(100);
export const medDateData = generateData(50);
export const smallDateData = generateData(15);

export const binnedDateData = generateBinnedData(7);
export const binnedDatePositiveOnly = generateBinnedData(
  7,
  0,
  50,
  DIVERGING_DATA_KEY_NEGATIVE
);
export const binnedDateNegativeOnly = generateBinnedData(
  7,
  0,
  50,
  DIVERGING_DATA_KEY_POSITIVE
);

export const singleDateData = generateDateData();

export const nonZeroDateData = [
  {
    key: generateDate(14),
    data: [5, 10]
  },
  {
    key: generateDate(10),
    data: [8, 14]
  },
  {
    key: generateDate(5),
    data: [5, 6]
  },
  {
    key: generateDate(2),
    data: [10, 18]
  }
];

export const multiDateData = [
  {
    key: 'Threat Intel',
    data: generateDateData()
  },
  {
    key: 'DLP',
    data: generateDateData()
  },
  {
    key: 'Syslog',
    data: generateDateData()
  }
];

export const singleDateBigIntData = [
  {
    key: generateDate(14),
    data: bigInt(98476124342)
  },
  {
    key: generateDate(10),
    data: bigInt(76129235932)
  },
  {
    key: generateDate(5),
    data: bigInt(60812341342)
  },
  {
    key: generateDate(2),
    data: bigInt(76129235932)
  }
];

export const longMultiDateData = range(25)
  .map(i => ({
    key: `Series-${i + 1}`,
    data: generateData(15).map(({ id, ...rest }) => ({ ...rest }))
  }))
  .reverse();
