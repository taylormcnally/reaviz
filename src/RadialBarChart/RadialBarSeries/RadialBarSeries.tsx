import React, { Component, Fragment, ReactElement } from 'react';
import { ChartInternalShallowDataShape } from '../../common/data';
import { RadialBar, RadialBarProps } from './RadialBar';
import { CloneElement } from '../../common/utils/children';
import { ColorSchemeType, getColor } from '../../common/color';

export interface RadialBarSeriesProps {
  data: ChartInternalShallowDataShape[];
  colorScheme: ColorSchemeType;
  innerRadius: number;
  xScale: any;
  yScale: any;
  id: string;
  bar: ReactElement<RadialBarProps, typeof RadialBar>;
  animated: boolean;
}

export class RadialBarSeries extends Component<RadialBarSeriesProps> {
  static defaultProps: Partial<RadialBarSeriesProps> = {
    colorScheme: 'cybertron',
    bar: <RadialBar />,
    animated: true
  };

  renderBar(point: ChartInternalShallowDataShape, index: number) {
    const {
      innerRadius,
      xScale,
      yScale,
      bar,
      id,
      data,
      animated,
      colorScheme
    } = this.props;

    return (
      <Fragment key={index}>
        <CloneElement<RadialBarProps>
          element={bar}
          id={`radialbar-${id}-${index}`}
          index={index}
          data={point}
          xScale={xScale}
          yScale={yScale}
          innerRadius={innerRadius}
          color={(point, index) =>
            getColor({ data, point, index, colorScheme })
          }
          barCount={data.length}
          animated={animated}
        />
      </Fragment>
    );
  }

  render() {
    const { data } = this.props;

    return <Fragment>{data.map((d, i) => this.renderBar(d, i))}</Fragment>;
  }
}
