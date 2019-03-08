# Scatter Plot

The scatter plot is a chart used to visualize two-dimensional data
using dots to show the relationship between two variables plotted
along the x and y axis.

View [Demo Source Code](https://github.com/jask-oss/reaviz/blob/master/src/ScatterPlot/ScatterPlot.story.tsx)


### Basic Example

For the chart, you pass an array of objects with a `key` and a 
`data` property. Both `key` and `data` can be a string, number, Date object, or bigInt.

```jsx
import { ScatterPlot } from 'reaviz';

const data = [
  { key: new Date(), data: 10 },
  ...more data...
];

<ScatterPlot
  width={750}
  height={400}
  data={data}
/>
```

### Custom Plot Point

To customize the point used, pass in a `ScatterPoint` with a custom SVG.

```jsx
import { ScatterPlot, ScatterSeries, ScatterPoint } from 'reaviz';

const data = [
  { key: new Date(), data: 10 },
  ...more data...
];

<ScatterPlot
  width={750}
  height={400}
  data={data}
  series={
    <ScatterSeries
      point={
        <ScatterPoint
          symbol={() => (
            <g transform="translate(-10, -10)">
              <polygon
                transform="scale(0.1)"
                points="100,10 40,198 190,78 10,78 160,198"
                style={{ fill: 'purple' }}
              />
            </g>
          )}
        />
      }
    />
  }
/>
```
