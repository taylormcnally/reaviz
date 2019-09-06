import React, { Component } from 'react';
import { HeatmapCell, HeatmapCellProps } from './HeatmapCell';
import { scaleQuantile } from 'd3-scale';
import { uniqueBy } from '../../common/utils/array';
import { extent } from 'd3-array';
import { PoseGroup } from 'react-pose';
import { PoseSVGGElement } from '../../common/utils/animations';
import { memoize } from 'lodash-es';
import { CloneElement } from '../../common/utils/children';

export interface HeatmapSeriesProps {
  padding: number;
  id: string;
  data: any;
  xScale: any;
  yScale: any;
  colorScheme: any;
  emptyColor: string;
  animated: boolean;
  cell: JSX.Element;
}

export class HeatmapSeries extends Component<HeatmapSeriesProps> {
  static defaultProps: Partial<HeatmapSeriesProps> = {
    padding: 0.1,
    animated: true,
    emptyColor: 'rgba(200,200,200,0.08)',
    colorScheme: ['rgba(28, 107, 86, 0.5)', '#2da283'],
    cell: <HeatmapCell />
  };

  getValueScale = memoize((data, colorScheme, emptyColor) => {
    const valueDomain = extent(uniqueBy(data, d => d.data, d => d.value));

    return point => {
      // For 0 values, lets show a placeholder fill
      if (point === undefined || point === null) {
        return emptyColor;
      }

      return scaleQuantile<string>()
        .domain(valueDomain)
        .range(colorScheme)(point);
    };
  });

  renderCell({ row, cell, rowIndex, cellIndex, valueScale, width, height }) {
    const { xScale, yScale, id, animated, cell: cellElement } = this.props;

    const x = xScale(row.key);
    const y = yScale(cell.x);
    const fill = valueScale(cell.value);

    return (
      <PoseSVGGElement key={`${id}-${rowIndex}-${cellIndex}`}>
        <CloneElement<HeatmapCellProps>
          element={cellElement}
          animated={animated}
          cellIndex={rowIndex + cellIndex}
          x={x}
          y={y}
          fill={fill}
          width={width}
          height={height}
          data={cell}
        />
      </PoseSVGGElement>
    );
  }

  render() {
    const {
      xScale,
      yScale,
      data,
      colorScheme,
      animated,
      emptyColor
    } = this.props;

    const valueScale = this.getValueScale(data, colorScheme, emptyColor);
    const height = yScale.bandwidth();
    const width = xScale.bandwidth();

    return (
      <PoseGroup animateOnMount={animated}>
        {data.map((row, rowIndex) =>
          row.data.map((cell, cellIndex) =>
            this.renderCell({
              height,
              width,
              valueScale,
              row,
              cell,
              rowIndex,
              cellIndex
            })
          )
        )}
      </PoseGroup>
    );
  }
}
