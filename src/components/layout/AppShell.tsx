import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Bell, ChevronDown, ChevronRight, CircleUser, Moon, PanelLeft, Sun } from 'lucide-react'
import { ValerieLogo } from '@/components/brand/ValerieLogo'
import { THEMES, useTheme } from '@/lib/theme'
import { site } from '@/data/site'
import { cn } from '@/lib/cn'

/**
 * The chat never owns navigation chrome. This shell only simulates the host:
 * - default: standalone page (logo + bell + user)
 * - ?shell=dashboard: a stand-in for the Valerie dashboard (dark sidebar + breadcrumb)
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [params] = useSearchParams()
  const dashboard = params.get('shell') === 'dashboard'
  const { dark, toggle } = useTheme()

  const right = (
    <div className="flex items-center gap-1">
      {THEMES && (
        <button onClick={toggle} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Toggle theme">
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      )}
      <span className="relative grid size-8 place-items-center rounded-lg text-muted-foreground"><Bell className="size-4" /><span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-amber-200 text-[10px] font-semibold text-amber-800">2</span></span>
      <span className="grid size-8 place-items-center rounded-lg text-muted-foreground"><CircleUser className="size-4" /></span>
    </div>
  )

  if (!dashboard) {
    return (
      <div className="flex h-full flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface-header px-5">
          {/* The logo opens the main design's Home (6 Nov; it opened /archive until then). A plain link, so from an archived
              version it leaves that version's basename. The archive stays at /archive. */}
          <a href="/" aria-label="Valerie" className="-m-1 rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
            <ValerieLogo className="h-[22px] text-foreground" />
          </a>
          {right}
        </header>
        <main className="min-h-0 flex-1">{children}</main>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface-header px-5">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <PanelLeft className="size-4" />
            <span className="mx-2 h-4 w-px bg-border" />
            <span>{site.workspace}</span><ChevronRight className="size-4" />
            <span>Brand Intelligence</span><ChevronRight className="size-4" />
            <span className="text-foreground">Conversational AI</span>
          </nav>
          {right}
        </header>
        <main className="min-h-0 flex-1">{children}</main>
      </div>
    </div>
  )
}

function DashboardSidebar() {
  const groups = ['Onboarding', 'Growth forecast', 'Growth master']
  const after = ['Business and financials', 'Operational management', 'Technical access']
  const item = 'flex h-10 items-center rounded-lg px-3 text-sm text-slate-300'
  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-sidebar p-3 text-white md:flex" style={{ backgroundImage: 'radial-gradient(rgba(148,163,184,.12) 1px, transparent 1px)', backgroundSize: '14px 14px' }}>
      <div className="px-2 py-3"><ValerieLogo className="h-7 text-white" /></div>
      <div className="mt-2 flex items-center gap-3 rounded-xl border border-brand-700/60 bg-white/5 p-3">
        <span className="grid size-8 place-items-center rounded-lg bg-teal-500 text-sm font-semibold">B</span>
        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{site.workspace}</span><span className="block text-xs text-slate-400">Brands</span></span>
        <ChevronDown className="size-4 text-slate-400" />
      </div>
      <nav className="mt-5 flex flex-col gap-0.5">
        <span className={item}>Overview</span>
        <span className={item}>Master dashboard</span>
        {groups.map((g) => <span key={g} className={cn(item, 'justify-between text-xs uppercase text-slate-400')}>{g}<ChevronRight className="size-4" /></span>)}
        <span className={cn(item, 'justify-between text-xs uppercase text-slate-200')}>Brand intelligence<ChevronDown className="size-4" /></span>
        <div className="ml-4 flex flex-col gap-0.5 border-l border-white/10 pl-2">
          <span className={item}>Dashboard</span>
          <span className={item}>Insights</span>
          <span className={cn(item, 'border border-white/10 bg-white/10 text-white')}>Conversational AI</span>
          <span className={item}>Reports</span>
        </div>
        {after.map((g) => <span key={g} className={cn(item, 'justify-between text-xs uppercase text-slate-400')}>{g}<ChevronRight className="size-4" /></span>)}
      </nav>
    </aside>
  )
}
