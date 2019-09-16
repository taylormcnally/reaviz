import React, { Component } from 'react';
import {
  RadialScatterSeries,
  RadialScatterPoint,
  RadialScatterPointProps
} from '../../RadialScatterPlot';
import { ChartInternalShallowDataShape } from '../../common/data';
import { CloneElement } from '../../common/utils';
import isEqual from 'is-equal';

export interface RadialPointSeriesProps {
  animated: boolean;
  color: any;
  activeValues?: any;
  data: ChartInternalShallowDataShape[];
  yScale: any;
  xScale: any;
  show: boolean | 'hover' | 'first' | 'last';
  point: JSX.Element;
}

export class RadialPointSeries extends Component<RadialPointSeriesProps> {
  static defaultProps: Partial<RadialPointSeriesProps> = {
    show: 'hover',
    point: <RadialScatterPoint />
  };

  isVisible(point: ChartInternalShallowDataShape, index: number) {
    const { show, activeValues, data } = this.props;
    const isActive = activeValues && point && isEqual(activeValues.x, point.x);

    if (show === 'hover') {
      return isActive;
    } else if (show === 'first') {
      if (activeValues) {
        return isActive;
      } else {
        return index === 0;
      }
    } else if (show === 'last') {
      if (activeValues) {
        return isActive;
      } else {
        return index === data.length - 1;
      }
    }

    return show;
  }

  render() {
    const { data, xScale, yScale, animated, point, color } = this.props;

    return (
      <RadialScatterSeries
        animated={animated}
        data={data}
        xScale={xScale}
        yScale={yScale}
        point={
          <CloneElement<RadialScatterPointProps>
            element={point}
            color={color}
            tooltip={null}
            visible={this.isVisible.bind(this)}
          />
        }
      />
    );
  }
}
