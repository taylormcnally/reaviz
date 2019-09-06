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
import { range, max } from 'd3-array';
import { memoize } from 'lodash-es';
import { HeatmapSeries } from './HeatmapSeries';
import { HeatmapCell } from './HeatmapCell';
import { ChartTooltip } from '../common/TooltipArea';
import { formatValue } from '../common/utils/formatting';

export interface CalendarHeatmapProps extends Omit<HeatmapProps, 'data'> {
  data: ChartShallowDataShape[];
  height: number;
  width: number;
}

export class CalendarHeatmap extends Component<CalendarHeatmapProps> {
  static defaultProps: Partial<CalendarHeatmapProps> = {
    height: 115,
    width: 715,
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
    // Build our x/y domains for days of week + number of weeks in year
    const yDomain = range(7).reverse();
    const xDomain = range(53);

    // Get the most recent date to get the range from
    // From the end date, lets find the start year of that
    // From that start year, lets find the end year for our bounds
    const endDate = max(rawData, d => d.key);
    const start = moment(endDate).startOf('year');
    const end = start.clone().endOf('year');

    // Filter out dates that are not in the start/end ranges
    // and turn them into something our chart can read
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

    const firstDayOfYear = start.weekday();
    const curDate = start.clone().subtract(firstDayOfYear, 'days');
    const rows = [];

    for (let week = 0; week <= 52; week++) {
      const row = {
        key: week,
        data: []
      };

      for (let day = 0; day <= 6; day++) {
        const dayValue = dates.find(d => d.key.isSame(curDate));

        row.data.push({
          key: day,
          data: dayValue ? dayValue.data : undefined,
          meta: {
            date: curDate.clone().toDate(),
            start: start.toDate(),
            end: end.toDate()
          }
        });

        curDate.add(1, 'day');
      }

      rows.push(row);
    }

    return {
      data: rows,
      yDomain,
      xDomain
    };
  });

  render() {
    const { data: rawData, ...rest } = this.props;
    const { data, yDomain, xDomain } = this.getDataDomains(rawData);
    const weekDays = moment.weekdaysShort();

    return (
      <Heatmap
        {...rest}
        data={data}
        yAxis={
          <LinearYAxis
            type="category"
            axisLine={null}
            domain={yDomain}
            tickSeries={
              <LinearYAxisTickSeries
                tickSize={20}
                line={null}
                label={
                  <LinearYAxisTickLabel padding={5} format={d => weekDays[d]} />
                }
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
                    align="end"
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
