import React, { Component, Fragment } from 'react';
import { HeatmapCell } from './HeatmapCell';
import { scaleQuantile } from 'd3-scale';
import { uniqueBy } from '../common/utils/array';
import { extent } from 'd3-array';
import { PoseGroup } from 'react-pose';
import { PoseSVGGElement } from 'common/utils/animations';

export interface HeatmapSeriesProps {
  padding: number;
  id: string;
  data: any;
  xScale: any;
  yScale: any;
  colorScheme: any;
  animated: boolean;
}

export class HeatmapSeries extends Component<HeatmapSeriesProps> {
  static defaultProps: Partial<HeatmapSeriesProps> = {
    padding: 0.1,
    animated: true,
    colorScheme: ['#5be0bd', '#2da283']
  };

  renderEmptySeries(width, height) {
    const { xScale, yScale, id, animated } = this.props;
    const xDomain = xScale.domain();
    const yDomain = yScale.domain();

    return xDomain.map(x =>
      yDomain.map((y, i) => (
        <PoseSVGGElement key={`${id}-${x}-${y}`}>
          <HeatmapCell
            animated={animated}
            cellIndex={i}
            fill="rgba(200,200,200,0.08)"
            x={xScale(x)}
            y={yScale(y)}
            width={width}
            height={height}
            data={{ x: y, key: x, value: 0 }}
          />
        </PoseSVGGElement>
      ))
    );
  }

  render() {
    const { xScale, yScale, data, id, colorScheme, animated } = this.props;

    const valueDomain = extent(uniqueBy(data, d => d.data, d => d.value));
    const valueScale = scaleQuantile<string>()
      .domain(valueDomain)
      .range(colorScheme);

    const height = yScale.bandwidth();
    const width = xScale.bandwidth();

    return (
      <PoseGroup animateOnMount={animated}>
        {this.renderEmptySeries(width, height)}
        {data.map((pair, i) =>
          pair.data.map((val, ii) => (
            <PoseSVGGElement key={`${id}-${i}-${ii}`}>
              <HeatmapCell
                animated={animated}
                cellIndex={ii}
                x={xScale(pair.key)}
                y={yScale(val.x)}
                fill={valueScale(val.value)}
                width={width}
                height={height}
                data={val}
              />
            </PoseSVGGElement>
          ))
        )}
      </PoseGroup>
    );
  }
}
