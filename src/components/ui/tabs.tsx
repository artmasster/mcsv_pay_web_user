import type { ReactNode } from 'react'
import { createContext, useContext, useId, useState } from 'react'
import { cn } from '@/lib/cn'

type TabsContextValue = {
  value: string
  setValue: (v: string) => void
  baseId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs parts must be used within <Tabs>')
  return ctx
}

export type TabsProps = {
  defaultValue: string
  children: ReactNode
  className?: string
  onValueChange?: (value: string) => void
}

export function Tabs({
  defaultValue,
  children,
  className,
  onValueChange,
}: TabsProps) {
  const baseId = useId()
  const [value, setValueInternal] = useState(defaultValue)
  const setValue = (v: string) => {
    setValueInternal(v)
    onValueChange?.(v)
  }
  return (
    <TabsContext.Provider value={{ value, setValue, baseId }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export type TabListProps = {
  children: ReactNode
  className?: string
  'aria-label'?: string
}

export function TabList({ children, className, 'aria-label': ariaLabel }: TabListProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1',
        className,
      )}
    >
      {children}
    </div>
  )
}

export type TabTriggerProps = {
  value: string
  children: ReactNode
  className?: string
}

export function TabTrigger({ value, children, className }: TabTriggerProps) {
  const { value: active, setValue, baseId } = useTabs()
  const selected = active === value
  const tabId = `${baseId}-tab-${value}`
  const panelId = `${baseId}-panel-${value}`

  return (
    <button
      type="button"
      role="tab"
      id={tabId}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        selected
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-600 hover:text-slate-900',
        className,
      )}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  )
}

export type TabPanelProps = {
  value: string
  children: ReactNode
  className?: string
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { value: active, baseId } = useTabs()
  const selected = active === value
  const tabId = `${baseId}-tab-${value}`
  const panelId = `${baseId}-panel-${value}`

  if (!selected) return null

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      className={cn('mt-4 focus:outline-none', className)}
      tabIndex={0}
    >
      {children}
    </div>
  )
}
