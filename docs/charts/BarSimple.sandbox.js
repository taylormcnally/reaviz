import React from 'react';
import { BarChart } from 'reaviz';
import './styles.css';

export const categoryData = [
  {
    key: 'Phishing Attack',
    data: 10
  },
  {
    key: 'IDS',
    data: 14
  },
  {
    key: 'Malware',
    data: 5
  },
  {
    key: 'DLP',
    data: 18
  }
];

export default () => (
  <div style={{ margin: '55px', textAlign: 'center' }}>
    <BarChart width={350} height={250} data={categoryData} />
  </div>
);
