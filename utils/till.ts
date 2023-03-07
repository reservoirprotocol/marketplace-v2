import dayjs, { UnitType } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

/**
 * Returns the time remaining from a given timestamp
 * @param timeStamp - A string in the format of "HH:MM:SS" representing the target time
 * @param format - (Optional) A string representing the unit of time to return the difference in (e.g., 'hour', 'minute', 'second', etc.). Defaults to 'hour'.
 * @returns The time remaining between the current time and the target time, in the specified format.
 */
export function timeTill(timeStamp: string, format: UnitType = 'hour') {
    const date = dayjs().set('hour', parseInt(timeStamp.slice(0, 2)));
    date.set('minute', parseInt(timeStamp.slice(3, 5)));
    date.set('second', parseInt(timeStamp.slice(6, 8)));
    return date.diff(dayjs(), format);
};
