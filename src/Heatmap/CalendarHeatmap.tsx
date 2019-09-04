import React, { Component } from 'react';
import { ChartShallowDataShape } from '../common/data';
import { Heatmap, HeatmapProps } from './Heatmap';
import moment from 'moment';
import {
  LinearXAxis,
  LinearYAxis,
  LinearYAxisTickSeries,
  LinearXAxisTickSeries,
  LinearYAxisTickLabel,
  LinearXAxisTickLabel
} from '../common/Axis';
import { group, range, sum } from 'd3-array';
import { memoize } from 'lodash-es';
import { HeatmapSeries } from './HeatmapSeries';
import { HeatmapCell } from './HeatmapCell';
import { ChartTooltip } from '../common/TooltipArea';
import { formatValue } from '../common/utils/formatting';

export interface CalendarHeatmapProps extends Omit<HeatmapProps, 'data'> {
  data: ChartShallowDataShape[];
}

export class CalendarHeatmap extends Component<CalendarHeatmapProps> {
  static defaultProps: Partial<CalendarHeatmapProps> = {
    series: (
      <HeatmapSeries
        padding={0.3}
        cell={
          <HeatmapCell
            tooltip={
              <ChartTooltip
                content={d =>
                  `${formatValue(d.metadata.meta.date)} ∙ ${formatValue(
                    d.metadata.value
                  )}`
                }
              />
            }
          />
        }
      />
    )
  };

  getDataDomains = memoize((rawData: ChartShallowDataShape[]) => {
    const start = moment().startOf('year');
    const end = moment().endOf('year');

    const yDomain = moment.weekdaysShort().reverse();
    const xDomain = range(52);

    const dates = rawData
      .filter(
        d =>
          moment(d.key as Date).isAfter(start) &&
          moment(d.key as Date).isBefore(end)
      )
      .map(d => ({
        key: moment(d.key as Date).startOf('day'),
        data: d.data
      }));

    const data = Array.from(
      group(dates, d => parseInt(d.key.format('w')), d => d.key.format('ddd')),
      ([key, weekData]) => ({
        key,
        data: Array.from(weekData, ([nestedKey, nestedData]) => ({
          key: nestedKey,
          data: sum(nestedData, d => d.data)
        })),
        meta: {
          start: start.toDate(),
          end: end.toDate(),
          date: start
            .clone()
            .add(key, 'weeks')
            .toDate()
        }
      })
    );

    return {
      data,
      yDomain,
      xDomain
    };
  });

  render() {
    const { data, ...rest } = this.props;
    const { data: calData, yDomain, xDomain } = this.getDataDomains(data);

    return (
      <Heatmap
        {...rest}
        data={calData}
        yAxis={
          <LinearYAxis
            type="category"
            axisLine={null}
            domain={yDomain}
            tickSeries={
              <LinearYAxisTickSeries
                tickSize={22}
                line={null}
                label={<LinearYAxisTickLabel padding={5} />}
              />
            }
          />
        }
        xAxis={
          <LinearXAxis
            type="category"
            axisLine={null}
            domain={xDomain}
            tickSeries={
              <LinearXAxisTickSeries
                line={null}
                label={
                  <LinearXAxisTickLabel
                    padding={5}
                    format={d =>
                      moment()
                        .startOf('year')
                        .add(d, 'weeks')
                        .format('MMMM')
                    }
                  />
                }
              />
            }
          />
        }
      />
    );
  }
}
