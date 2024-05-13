import '@testing-library/jest-dom/jest-globals'

import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { CodeVerificationInput } from './CodeVerificationInput'

describe('CodeVerificationInput', () => {
  it('should render multiple digit inputs', () => {
    // arrange

    // act
    render(
      <CodeVerificationInput value="" onChange={jest.fn()} digitsCount={3} />
    )

    // assert
    expect(
      screen.getByRole('textbox', { name: 'Dígito 1' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'Dígito 2' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'Dígito 3' })
    ).toBeInTheDocument()
  })

  it('should only allow numeric characters when typing', async () => {
    // arrange
    const digitsCount = 3
    function TestComponent() {
      const [code, setCode] = useState('')

      return (
        <CodeVerificationInput
          value={code}
          onChange={(v) => setCode(v)}
          digitsCount={digitsCount}
        />
      )
    }

    // act
    render(<TestComponent />)
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Dígito 1' }),
      'abc'
    )

    // assert
    expect(screen.getByRole('textbox', { name: 'Dígito 1' })).toHaveValue('')
  })

  it('should move focus to next input when user fills an input', async () => {
    // arrange
    const digitsCount = 3
    function TestComponent() {
      const [code, setCode] = useState('')

      return (
        <CodeVerificationInput
          value={code}
          onChange={(v) => setCode(v)}
          digitsCount={digitsCount}
        />
      )
    }

    // act
    render(<TestComponent />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Dígito 1' }), '2')

    // assert
    expect(screen.getByRole('textbox', { name: 'Dígito 2' })).toHaveFocus()
  })

  it('should preserve focus when user fills the last input', async () => {
    // arrange
    const digitsCount = 3
    function TestComponent() {
      const [code, setCode] = useState('')

      return (
        <CodeVerificationInput
          value={code}
          onChange={(v) => setCode(v)}
          digitsCount={digitsCount}
        />
      )
    }

    // act
    render(<TestComponent />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Dígito 1' }), '3')
    await userEvent.type(screen.getByRole('textbox', { name: 'Dígito 2' }), '2')
    await userEvent.type(screen.getByRole('textbox', { name: 'Dígito 3' }), '1')

    // assert
    expect(screen.getByRole('textbox', { name: 'Dígito 3' })).toHaveFocus()
  })

  describe('when the user presses backspace', () => {
    it('should clear the previous input and move focus to it when input is empty', async () => {
      // arrange
      const digitsCount = 3
      function TestComponent() {
        const [code, setCode] = useState('12')

        return (
          <CodeVerificationInput
            value={code}
            onChange={(v) => setCode(v)}
            digitsCount={digitsCount}
          />
        )
      }

      // act
      render(<TestComponent />)
      await userEvent.click(screen.getByRole('textbox', { name: 'Dígito 3' }))
      await userEvent.keyboard('{Backspace}')

      // assert
      expect(screen.getByRole('textbox', { name: 'Dígito 2' })).toHaveFocus()
    })

    it('should preserve focus when input is filled', async () => {
      // arrange
      const digitsCount = 3
      function TestComponent() {
        const [code, setCode] = useState('123')

        return (
          <CodeVerificationInput
            value={code}
            onChange={(v) => setCode(v)}
            digitsCount={digitsCount}
          />
        )
      }

      // act
      render(<TestComponent />)
      await userEvent.clear(screen.getByRole('textbox', { name: 'Dígito 3' }))

      // assert
      expect(screen.getByRole('textbox', { name: 'Dígito 3' })).toHaveFocus()
    })

    it('should preserve focus when it is the first input', async () => {
      // arrange
      const digitsCount = 3
      function TestComponent() {
        const [code, setCode] = useState('')

        return (
          <CodeVerificationInput
            value={code}
            onChange={(v) => setCode(v)}
            digitsCount={digitsCount}
          />
        )
      }

      // act
      render(<TestComponent />)
      await userEvent.click(screen.getByRole('textbox', { name: 'Dígito 1' }))
      await userEvent.keyboard('{Backspace}')

      // assert
      expect(screen.getByRole('textbox', { name: 'Dígito 1' })).toHaveFocus()
    })
  })
})
