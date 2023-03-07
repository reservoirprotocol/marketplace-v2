import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function timeTill(timestamp: number) {
    return dayjs.unix(timestamp).toNow()
};