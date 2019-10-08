import React from 'react';
import ReactDOM from 'react-dom';
import { BarChart } from 'reaviz';

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

const App = () => (
  <div style={{ margin: '55px' }}>
    <BarChart width={350} height={250} data={categoryData} />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
