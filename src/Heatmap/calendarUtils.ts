import { range, min } from 'd3-array';
import moment from 'moment';
import { ChartShallowDataShape } from '../common/data';

export type CalendarView = 'year' | 'month';

export const buildDataScales = (
  rawData: ChartShallowDataShape[],
  view: CalendarView
) => {
  // Get the most recent date to get the range from
  // From the end date, lets find the start year/month of that
  // From that start year/month, lets find the end year/month for our bounds
  const startDate = min(rawData, d => d.key);
  const start = moment(startDate).startOf('month');
  const endDomain = view === 'year' ? 53 : 5;
  const end = start.clone().add(endDomain, 'weeks');
  // .endOf(view);

  // Base on the view type, swap out some ranges
  const xDomainRange = view === 'year' ? 53 : 5;

  // Build our x/y domains for days of week + number of weeks in year
  const yDomain = range(7).reverse();
  const xDomain = range(xDomainRange);

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

  // Find the first day of the duration and subtract the delta
  const firstDayOfStart = start.weekday();
  const curDate = start.clone().subtract(firstDayOfStart, 'days');
  const rows = [] as any;

  // Build out the dataset for the n duration
  for (let week = 0; week < xDomainRange; week++) {
    const row = {
      key: week,
      data: [] as any
    };

    for (let day = 0; day <= 6; day++) {
      const dayValue = dates.find(d => d.key.isSame(curDate));

      row.data.push({
        key: day,
        data: dayValue ? dayValue.data : undefined,
        metadata: {
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
    xDomain,
    start
  };
};
