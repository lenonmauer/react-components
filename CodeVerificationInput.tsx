import {
  useEffect,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
  type InputHTMLAttributes,
} from 'react'

type CodeVerificationInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  value: string
  onChange(value: string): void
  digitsCount: number
}

const makeIndexArray = (length: number) =>
  Array.from({ length }, (_, index) => index)

const isValidDigit = (value: string) => /^\d$/.test(value)

export function CodeVerificationInput({
  value,
  onChange,
  digitsCount,
}: CodeVerificationInputProps) {
  const inputRefs = useRef<HTMLInputElement[]>([])
  const focusedInputIndex =
    value.length === digitsCount ? digitsCount - 1 : value.length

  const clearInput = (index: number) => {
    const nextValue = `${value.substring(0, index)}`
    onChange(nextValue)
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const digit = event.target.value.charAt(0)

    if (!digit.length) {
      clearInput(index)
      return
    }

    if (!isValidDigit(digit)) return

    const nextValue = `${value.substring(0, index)}${digit}`
    onChange(nextValue)
  }

  const clearPreviousInput = () => clearInput(value.length - 1)

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const isBackspace = event.key === 'Backspace'
    const wasPreviouslyFilled = !!value.charAt(index)

    if (!isBackspace || wasPreviouslyFilled) return

    event.preventDefault()
    clearPreviousInput()
  }

  useEffect(() => {
    inputRefs.current[focusedInputIndex].focus()
  }, [focusedInputIndex])

  return makeIndexArray(digitsCount).map((index) => {
    return (
      <input
        key={index}
        value={value[index] || ''}
        onChange={(event) => handleChange(event, index)}
        onKeyDown={(event) => handleKeyDown(event, index)}
        aria-label={`Dígito ${index + 1}`}
        maxLength={1}
        ref={(element) => (inputRefs.current[index] = element!)}
        disabled={index !== focusedInputIndex}
      />
    )
  })
}
