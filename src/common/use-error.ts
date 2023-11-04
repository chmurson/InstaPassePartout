import { useCallback, useRef, useState } from 'react'

export const useError = () => {
  const [error, setError] = useState<string>()
  const timeoutHandler = useRef<number>()

  const addError = useCallback((error: string) => {
    clearTimeout(timeoutHandler.current)

    setError(error)

    timeoutHandler.current = window.setTimeout(() => setError(undefined), 5000)
  }, [])

  return {
    addError,
    error,
  }
}
