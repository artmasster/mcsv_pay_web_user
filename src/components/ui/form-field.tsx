import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Input, type InputProps } from './input'
import { Label } from './label'

export type FormFieldProps = {
  id: string
  label: string
  hint?: string
  error?: string
  children?: ReactNode
  className?: string
}

/** label + children + hint/error (a11y: htmlFor + id + aria-describedby) */
export function FormField({
  id,
  label,
  hint,
  error,
  children,
  className,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errId = error ? `${id}-error` : undefined

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error && (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} className="text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export type FormInputProps = Omit<FormFieldProps, 'children'> & InputProps

export function FormInput({
  id,
  label,
  hint,
  error,
  className,
  'aria-invalid': ariaInvalid,
  ...inputProps
}: FormInputProps) {
  return (
    <FormField id={id} label={label} hint={hint} error={error} className={className}>
      <Input
        id={id}
        aria-invalid={error ? true : ariaInvalid}
        aria-describedby={
          [hint && !error ? `${id}-hint` : '', error ? `${id}-error` : '']
            .filter(Boolean)
            .join(' ') || undefined
        }
        {...inputProps}
      />
    </FormField>
  )
}
