import { Dispatch, SetStateAction, useState } from 'react'

type useStateType<S> = [S, Dispatch<SetStateAction<S>>]

const useFallbackState = <T>(defaultValue: T, state?: useStateType<T>) => {
  const _state = useState<T>(defaultValue)

  if (state) {
    return state
  }

  return _state
}

export default useFallbackState
