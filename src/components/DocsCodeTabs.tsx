import { TabList, TabPanel, Tabs, TabTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/cn'
import type { DocsCodeTab } from '@/lib/docsCodeSamples'

const preClass =
  'overflow-x-auto rounded-xl border border-slate-200 bg-slate-950 p-4 text-[0.75rem] leading-relaxed text-slate-100'

type Props = {
  tabs: DocsCodeTab[]
  defaultValue?: string
  className?: string
}

export function DocsCodeTabs({ tabs, defaultValue, className }: Props) {
  const def = defaultValue ?? tabs[0]?.value ?? ''
  if (tabs.length === 0) return null
  return (
    <Tabs defaultValue={def} className={cn('w-full', className)}>
      <div className="-mx-1 overflow-x-auto pb-1">
        <TabList
          aria-label="เลือกภาษาตัวอย่าง"
          className="inline-flex w-max min-w-full flex-nowrap gap-0.5 sm:flex-wrap"
        >
          {tabs.map((t) => (
            <TabTrigger
              key={t.value}
              value={t.value}
              className="shrink-0 whitespace-nowrap text-xs sm:text-sm"
            >
              {t.label}
            </TabTrigger>
          ))}
        </TabList>
      </div>
      {tabs.map((t) => (
        <TabPanel key={t.value} value={t.value}>
          <pre className={preClass}>
            <code>{t.code}</code>
          </pre>
        </TabPanel>
      ))}
    </Tabs>
  )
}
