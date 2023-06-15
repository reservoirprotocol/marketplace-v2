import { ExpirationOption } from '../types/ExpirationOption'

const expirationOptions: ExpirationOption[] = [
  {
    text: '1 Hour',
    value: 'hour',
    relativeTime: 1,
    relativeTimeUnit: 'h',
  },
  {
    text: '12 Hours',
    value: '12 hours',
    relativeTime: 12,
    relativeTimeUnit: 'h',
  },
  {
    text: '1 Day',
    value: '1 day',
    relativeTime: 1,
    relativeTimeUnit: 'd',
  },
  {
    text: '3 Day',
    value: '3 days',
    relativeTime: 3,
    relativeTimeUnit: 'd',
  },
  { text: '1 Week', value: 'week', relativeTime: 1, relativeTimeUnit: 'w' },
  { text: '1 Month', value: 'month', relativeTime: 1, relativeTimeUnit: 'M' },
  {
    text: '3 Months',
    value: '3 months',
    relativeTime: 3,
    relativeTimeUnit: 'M',
  },
  {
    text: '6 Months',
    value: '6 months',
    relativeTime: 6,
    relativeTimeUnit: 'M',
  },
]

export default expirationOptions
