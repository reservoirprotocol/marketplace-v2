import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function timeTill(timeStamp: string ) {
    const date = dayjs().set('hour', parseInt(timeStamp.slice(0, 2)));

    date.set('minute', parseInt(timeStamp.slice(3, 5)));
    date.set('second', parseInt(timeStamp.slice(6, 8)));

    return date.diff(dayjs(), 'hour');
};