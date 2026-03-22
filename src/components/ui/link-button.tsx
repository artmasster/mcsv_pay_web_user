import { Link, type LinkProps } from 'react-router-dom'
import { buttonClassName, type ButtonSize, type ButtonVariant } from './button'

export type LinkButtonProps = LinkProps & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function LinkButton({
  variant,
  size,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  )
}
