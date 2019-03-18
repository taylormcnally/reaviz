import { ChartInternalDataTypes } from '../data';
import { isNumber, isDate } from 'lodash-es';

// https://stackoverflow.com/questions/673905/best-way-to-determine-users-locale-within-browser
const getNavigatorLanguage = () => (navigator.languages && navigator.languages.length) ?
  navigator.languages[0] :
    (navigator as any).userLanguage ||
    navigator.language ||
    (navigator as any).browserLanguage ||
    'en';

const locale = getNavigatorLanguage();

const options = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour12: true,
  formatMatcher: 'best fit'
};

/**
 * Format a value based on type.
 */
export function formatValue(value: ChartInternalDataTypes): string {
  if (value !== undefined) {
    if (isDate(value)) {
      return (value as Date).toLocaleDateString(locale, options);
    } else if (isNumber(value)) {
      return value.toLocaleString();
    }

    return value as string;
  }

  return 'No value';
}
