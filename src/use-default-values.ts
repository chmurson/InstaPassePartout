import { useCallback } from 'react'
import { possibleRatios, Ratio } from './main-types.ts'

const STORAGE_KEY_PREFIX = 'image-resizer'
const STORAGE_KEY_RATIO = `${STORAGE_KEY_PREFIX}-ratio`
const STORAGE_KEY_MARGINS = `${STORAGE_KEY_PREFIX}-margins`

function getDefaultRatio(): Ratio {
  const ratio = localStorage.getItem(STORAGE_KEY_RATIO)
  if (!ratio || !possibleRatios.includes(ratio as Ratio)) {
    return '4_5'
  }
  return ratio as Ratio
}

function getDefaultMargin(): number {
  const margins = localStorage.getItem(STORAGE_KEY_MARGINS)
  const parsedMargins = parseFloat(margins ?? '')
  if (Number.isNaN(parsedMargins)) {
    return 10
  }
  return parsedMargins
}

const initDefaultValues = {
  ratio: getDefaultRatio(),
  margins: getDefaultMargin(),
}

export function usePersistedDefaultValues() {
  const setDefaultRatio = useCallback((value: string) => {
    localStorage.setItem(STORAGE_KEY_RATIO, value)
  }, [])

  const setDefaultMargin = useCallback((value: string) => {
    localStorage.setItem(STORAGE_KEY_MARGINS, value)
  }, [])

  const { ratio, margins } = initDefaultValues

  return {
    defaultRatio: ratio,
    defaultMarginSize: margins,
    setDefaultMargin,
    setDefaultRatio,
  }
}
