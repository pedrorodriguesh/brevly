import { Field } from '@base-ui/react/field'
import type { ComponentProps } from 'react'

interface InputProps extends ComponentProps<'input'> {
  label: string
  description?: string
  error?: string
  prefix?: string
}

export function Input({
  label,
  description,
  error,
  prefix,
  ...props
}: InputProps) {
  return (
    <Field.Root className="flex w-full flex-col items-start gap-2">
      <Field.Label className="text-xs font-normal text-gray-400">
        {label}
      </Field.Label>
      <div className="relative w-full">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-light text-gray-400 pointer-events-none">
            {prefix}
          </span>
        )}
        <Field.Control
          {...props}
          className={`h-12 w-full rounded-lg border border-gray-200 text-base text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800 ${
            prefix ? 'pl-16' : 'pl-3.5'
          }`}
        />
      </div>
      {error && <span className="text-sm text-red-800">{error}</span>}
      {description && !error && (
        <Field.Description className="text-sm text-gray-600">
          {description}
        </Field.Description>
      )}
    </Field.Root>
  )
}
