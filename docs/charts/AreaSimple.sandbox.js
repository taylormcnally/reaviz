import React from 'react';
import { AreaChart } from 'reaviz';

export const categoryData = [
  {
    key: new Date('11/29/2019'),
    data: 10
  },
  {
    key: new Date('11/30/2019'),
    data: 14
  },
  {
    key: new Date('12/01/2019'),
    data: 5
  },
  {
    key: new Date('12/02/2019'),
    data: 18
  }
];

export default () => (
  <div style={{ margin: '55px', textAlign: 'center' }}>
    <AreaChart width={350} height={250} data={categoryData} />
  </div>
);
