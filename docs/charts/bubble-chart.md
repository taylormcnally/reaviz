# Bubble Chart

The bubble chart is a variation of the scatter plot and supports a third dimension/variable whose value is represented by the size of the dots.

View [Demo Source Code](https://github.com/jask-oss/reaviz/blob/master/src/ScatterPlot/ScatterPlot.story.tsx#L109)

### Basic Example

In this example, the bubble size is given by the `size` property of each data point.

Since the bubble chart is supported by the scatter plot, you can use all the other supported features by the scatter plot components.

```jsx
import { ScatterPlot, ScatterSeries, ScatterPoint } from 'reaviz';

const data = [
  { key: new Date(), data: 10, size: 6 },
  ...more data...
];

<ScatterPlot
  height={400}
  width={750}
  data={data}
  margins={20}
  series={
    <ScatterSeries
      point={
        <ScatterPoint
          fill="rgba(174, 52, 255, .5)"
          size={d => d.size}
        />
      }
    />
  }
/>
```
