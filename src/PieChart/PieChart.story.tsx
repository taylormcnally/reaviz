import React, { useState, Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import chroma from 'chroma-js';

import { PieChart } from './PieChart';
import { categoryData, randomNumber, browserData } from '../../demo';
import { PieArcSeries } from './PieArcSeries';
import { number, object, text } from '@storybook/addon-knobs';

storiesOf('Charts/Pie/Pie', module)
  .add(
    'Simple',
    () => {
      const height = number('Height', 250);
      const width = number('Width', 350);
      const data = object('Data', categoryData);

      return (
        <PieChart
          width={width}
          height={height}
          data={data}
          series={
            <PieArcSeries
              colorScheme={chroma
                .scale(['#4dd0e1', '#1976d2'])
                .colors(data.length)}
            />
          }
        />
      );
    },
    { options: { showPanel: true } }
  )
  .add(
    'Explode',
    () => {
      const height = number('Height', 250);
      const width = number('Width', 350);
      const data = object('Data', categoryData);

      return (
        <PieChart
          width={height}
          height={width}
          data={data}
          series={
            <PieArcSeries
              explode={true}
              colorScheme={chroma
                .scale(['#4dd0e1', '#1976d2'])
                .colors(data.length)}
            />
          }
        />
      );
    },
    { options: { showPanel: true } }
  )
  .add('Label Overlap', () => (
    <PieChart
      width={350}
      height={250}
      data={browserData}
      series={
        <PieArcSeries
          colorScheme={chroma
            .scale(['#4dd0e1', '#1976d2'])
            .colors(browserData.length)}
        />
      }
    />
  ))
  .add('Live Updating', () => <LiveUpdatingStory />)
  .add('Autosize', () => (
    <div style={{ width: '50vw', height: '50vh', border: 'solid 1px red' }}>
      <PieChart
        data={categoryData}
        series={
          <PieArcSeries
            colorScheme={chroma
              .scale(['#4dd0e1', '#1976d2'])
              .colors(categoryData.length)}
          />
        }
      />
    </div>
  ));

storiesOf('Charts/Pie/Donut', module)
  .add(
    'Simple',
    () => {
      const height = number('Height', 250);
      const width = number('Width', 350);
      const data = object('Data', categoryData);

      return (
        <PieChart
          width={width}
          height={height}
          data={data}
          series={
            <PieArcSeries
              doughnut={true}
              colorScheme={chroma
                .scale(['#4dd0e1', '#1976d2'])
                .colors(data.length)}
            />
          }
        />
      );
    },
    { options: { showPanel: true } }
  )
  .add('Labels', () => (
    <PieChart
      width={350}
      height={250}
      data={categoryData}
      series={
        <PieArcSeries
          doughnut={true}
          colorScheme={chroma
            .scale(['#4dd0e1', '#1976d2'])
            .colors(categoryData.length)}
        />
      }
    />
  ))
  .add(
    'Inner Label',
    () => {
      const height = number('Height', 250);
      const width = number('Width', 350);
      const words = text('Label', 'Attacks');
      const data = object('Data', categoryData);

      return (
        <div
          style={{
            position: 'relative',
            height: '250px',
            width: '350px',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0 }}>
            <PieChart
              width={width}
              height={height}
              data={data}
              series={
                <PieArcSeries
                  doughnut={true}
                  label={null}
                  colorScheme={chroma
                    .scale(['#4dd0e1', '#1976d2'])
                    .colors(data.length)}
                />
              }
            />
          </div>
          <h2 style={{ margin: '0 5px', padding: 0, color: 'white' }}>
            {data.length} {words}
          </h2>
        </div>
      );
    },
    { options: { showPanel: true } }
  );

const LiveUpdatingStory = () => {
  const [data, setData] = useState([...categoryData]);

  const updateData = () => {
    const newData = [...data];
    const updateCount = randomNumber(1, 4);

    let idx = 0;
    while (idx <= updateCount) {
      const updateIndex = randomNumber(0, data.length - 1);
      newData[updateIndex] = {
        ...newData[updateIndex],
        data: randomNumber(10, 100)
      };

      idx++;
    }

    setData(newData);
  };

  return (
    <Fragment>
      <PieChart
        width={350}
        height={250}
        data={data}
        series={
          <PieArcSeries
            colorScheme={chroma
              .scale(['#ACB7C9', '#418AD7'])
              .colors(data.length)}
          />
        }
      />
      <br />
      <button onClick={updateData}>Update</button>
    </Fragment>
  );
};
