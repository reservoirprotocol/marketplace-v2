import { ManipulateType } from 'dayjs'

export type ExpirationOption = {
  text: string
  value: string
  relativeTime: number | null
  relativeTimeUnit: ManipulateType | null
}
