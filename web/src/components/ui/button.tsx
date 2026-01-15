import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
  base: 'font-medium cursor-pointer',
  variants: {
    size: {
      default: 'p-3 w-full rounded-lg',
      iconLabel:
        'flex justify-center items-center gap-2 p-2 w-28 text-sm h-8 rounded-sm',
      iconOnly: 'p-2 rounded-sm',
    },
    color: {
      primary: 'bg-blue-base text-white hover:bg-blue-dark',
      icon: 'bg-gray-200 text-gray-400 hover:border-gray-600',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
    },
  },
})

export function Button({
  size,
  color,
  disabled,
  className,
  ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={buttonVariants({ size, color, disabled, className })}
      disabled={disabled}
      {...props}
    />
  )
}
