import { FC, useEffect, useRef, useState } from 'react'
import { FormControl, TextField } from '@mui/material'
import { usePersistedState } from '../common/use-persisted-state.ts'
import { parseFloatSafely } from '../common/parse-float-safely.ts'

type Props = {
  onChange: (value: number) => void
}
const max = 10
const min = 0.1
export const CustomRationValue: FC<Props> = ({ onChange }) => {
  const [customRatio, setCustomRatio] = usePersistedState<number>(1, 'CustomRatioValue', {
    fromString: parseFloatSafely,
    toString: (x) => x.toString(),
  })

  const [currentValue, setCurrentValue] = useState(customRatio.toFixed(2))

  const handleOnChange = () => {
    const value = Math.max(Math.min(parseFloatSafely(currentValue), max), min)
    setCustomRatio(value)
    setCurrentValue(value.toString())
  }

  const prevValue = useRef<number>()

  useEffect(() => {
    if (prevValue.current !== customRatio) {
      onChange(customRatio)
      prevValue.current = customRatio
    }
  }, [customRatio, onChange])

  return (
    <FormControl variant="standard" sx={{ minWidth: 80 }}>
      <TextField
        label="Ratio value"
        variant="standard"
        value={currentValue}
        type="number"
        inputProps={{
          min,
          max,
          step: 0.1,
        }}
        sx={{ width: 80 }}
        onChange={(e) => setCurrentValue(e.currentTarget.value)}
        onBlur={handleOnChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleOnChange()
          }
        }}
      />
    </FormControl>
  )
}
