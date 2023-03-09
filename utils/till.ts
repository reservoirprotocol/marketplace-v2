import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

/**
 * REGEX to parse out YYYY-MM-DD HH:MM:SS from a raw string
 * @returns YYYY-MM-DD HH:MM:SS
 */
export const DATE_REGEX = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/

/**
 * Returns a human-readable string indicating the time remaining until the provided time string.
 * @param timeString The target time string in the format "YYYY-MM-DD HH:MM:SS".
 * @returns A human-readable string indicating the time remaining until the target time.
 */
export const timeTill = (timeString: string | undefined): string => {
  const duration = dayjs(timeString).diff(dayjs(), 'second')
  const durationInMinutes = Math.floor(duration / 60)

  const remainingHours = Math.floor(durationInMinutes / 60)
  const remainingMinutes = durationInMinutes % 60

  if (remainingHours > 0) {
    return `${remainingHours} hour${
      remainingHours > 1 ? 's' : ''
    } and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`
  } else {
    return `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`
  }
}
