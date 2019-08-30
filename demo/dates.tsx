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

export const largeDateData = generateData(100);
export const medDateData = generateData(50);
export const smallDateData = generateData(15);

export const binnedDateData = [
  {
    key: '1/10/2019',
    data: [
      {
        key: 'Closed',
        data: -8
      },
      {
        key: 'Opened',
        data: 5
      }
    ]
  },
  {
    key: '1/11/2019',
    data: [
      {
        key: 'Closed',
        data: -1
      },
      {
        key: 'Opened',
        data: 10
      }
    ]
  },
  {
    key: '1/12/2019',
    data: [
      {
        key: 'Closed',
        data: -12
      },
      {
        key: 'Opened',
        data: 3
      }
    ]
  },
  {
    key: '1/13/2019',
    data: [
      {
        key: 'Closed',
        data: -5
      },
      {
        key: 'Opened',
        data: 0
      }
    ]
  },
  {
    key: '1/14/2019',
    data: [
      {
        key: 'Closed',
        data: -2
      },
      {
        key: 'Opened',
        data: 10
      }
    ]
  },
  {
    key: '1/15/2019',
    data: [
      {
        key: 'Closed',
        data: -8
      },
      {
        key: 'Opened',
        data: 3
      }
    ]
  }
];

export const singleDateData = [
  {
    key: generateDate(14),
    id: '1',
    data: 10
  },
  {
    key: generateDate(10),
    id: '2',
    data: 8
  },
  {
    key: generateDate(5),
    id: '3',
    data: 18
  },
  {
    key: generateDate(2),
    id: '4',
    data: 10
  }
];

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
    data: [
      {
        key: generateDate(14),
        data: 5
      },
      {
        key: generateDate(10),
        data: 10
      },
      {
        key: generateDate(5),
        data: 12
      },
      {
        key: generateDate(2),
        data: 10
      }
    ]
  },
  {
    key: 'DLP',
    data: [
      {
        key: generateDate(14),
        data: 10
      },
      {
        key: generateDate(10),
        data: 15
      },
      {
        key: generateDate(5),
        data: 12
      },
      {
        key: generateDate(2),
        data: 10
      }
    ]
  },
  {
    key: 'Syslog',
    data: [
      {
        key: generateDate(14),
        data: 10
      },
      {
        key: generateDate(10),
        data: 20
      },
      {
        key: generateDate(5),
        data: 10
      },
      {
        key: generateDate(2),
        data: 12
      }
    ]
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

export const longMultiDateData =
  range(25)
  .map(i => ({
    key: `Series-${i + 1}`,
    data: generateData(15).map(({ id, ...rest }) => ({ ...rest }))
  }))
  .reverse();
