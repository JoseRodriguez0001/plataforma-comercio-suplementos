"use client"

import { useEffect, useState } from "react"

type QuantityInputProps = {
  value: number
  max?: number
  disabled?: boolean
  onChange: (quantity: number) => void
  "data-testid"?: string
}

/**
 * Selector de cantidad con botones − / + y campo editable. Permite cualquier
 * cantidad (no topado en 10). Se valida contra el stock: si se excede, el
 * backend rechaza la actualización y se muestra el error.
 */
const QuantityInput = ({
  value,
  max,
  disabled,
  onChange,
  "data-testid": dataTestId,
}: QuantityInputProps) => {
  const [local, setLocal] = useState(String(value))

  useEffect(() => {
    setLocal(String(value))
  }, [value])

  const clamp = (n: number) => {
    let q = Number.isNaN(n) ? 1 : Math.floor(n)
    if (q < 1) q = 1
    if (typeof max === "number" && q > max) q = max
    return q
  }

  const commit = (n: number) => {
    const q = clamp(n)
    setLocal(String(q))
    if (q !== value) onChange(q)
  }

  const atMax = typeof max === "number" && value >= max

  return (
    <div
      className="flex items-center rounded-rounded border border-ui-border-base bg-white"
      data-testid={dataTestId}
    >
      <button
        type="button"
        aria-label="Disminuir cantidad"
        className="flex h-9 w-8 items-center justify-center text-lg text-ui-fg-subtle hover:text-ui-fg-base disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={() => commit(value - 1)}
        disabled={disabled || value <= 1}
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={local}
        disabled={disabled}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => commit(parseInt(local, 10))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            commit(parseInt(local, 10))
          }
        }}
        className="h-9 w-12 border-x border-ui-border-base bg-transparent text-center text-ui-fg-base outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Aumentar cantidad"
        className="flex h-9 w-8 items-center justify-center text-lg text-ui-fg-subtle hover:text-ui-fg-base disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={() => commit(value + 1)}
        disabled={disabled || atMax}
      >
        +
      </button>
    </div>
  )
}

export default QuantityInput
