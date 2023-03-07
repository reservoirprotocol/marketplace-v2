import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function (timestamp?: number) {
  const [timeTill, setTimeTill] = useState('');

  useEffect(() => {
    if (timestamp) {
      setTimeTill(dayjs.unix(timestamp).toNow())
    } else {
      setTimeTill('');
    }
  }, [timestamp]);

  return timeTill;
}