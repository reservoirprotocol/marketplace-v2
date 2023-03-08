import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

type TimeTill = {
  time: number
  format: 'hour' | 'minute'
}

/**
 * Calculate the time remaining until a specified time
 * @param {string} timeString - The time to calculate the remaining time until, in the format 'HH:mm:ss'
 * @returns {{time: number, format: Format}} The remaining time until the specified time, in the format {time, format}
 */
export function timeTill(timeString: string): TimeTill {
  const date = dayjs(timeString, 'HH:mm:ss').diff(dayjs(), 'minute')

  const format = date >= 60 ? 'hour' : 'minute'
  const time = format === 'hour' ? Math.floor(date / 60) : date

  return {
    time,
    format,
  }
}
