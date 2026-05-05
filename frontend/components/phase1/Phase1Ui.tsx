import React from 'react';
import {
  AlertCircle,
  Inbox,
  LoaderCircle,
  Search,
  type LucideIcon,
} from 'lucide-react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {eyebrow}
          </div>
        ) : null}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  helper?: string;
  icon: LucideIcon;
  accent?: 'slate' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue';
}

const STAT_ACCENTS: Record<NonNullable<StatCardProps['accent']>, string> = {
  slate: 'border-slate-200 bg-slate-50 text-slate-700',
  indigo: 'border-indigo-100 bg-indigo-50 text-indigo-700',
  emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-100 bg-amber-50 text-amber-700',
  rose: 'border-rose-100 bg-rose-50 text-rose-700',
  blue: 'border-blue-100 bg-blue-50 text-blue-700',
};

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  accent = 'slate',
}: StatCardProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {label}
          </div>
          <div className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{value}</div>
          {helper ? (
            <div className="mt-2 text-xs font-medium text-slate-500">{helper}</div>
          ) : null}
        </div>
        <div className={`rounded-2xl border p-3 ${STAT_ACCENTS[accent]}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

interface SectionCardProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionCard({ title, description, actions, children }: SectionCardProps) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}

interface StatusBadgeProps {
  value: string | null | undefined;
}

function toneFromStatus(value: string) {
  const normalized = value.toUpperCase();

  if (['ACTIVE', 'APPROVED', 'COMPLETED', 'FILLED', 'VISIBLE'].includes(normalized)) {
    return 'border-emerald-100 bg-emerald-50 text-emerald-700';
  }

  if (['PENDING', 'IN_PROGRESS', 'SUBMITTED', 'DRAFT'].includes(normalized)) {
    return 'border-amber-100 bg-amber-50 text-amber-700';
  }

  if (['INACTIVE', 'REJECTED', 'CANCELLED', 'TERMINATED', 'HIDDEN'].includes(normalized)) {
    return 'border-rose-100 bg-rose-50 text-rose-700';
  }

  return 'border-slate-200 bg-slate-100 text-slate-600';
}

export function StatusBadge({ value }: StatusBadgeProps) {
  const label =
    value
      ?.toLowerCase()
      .split(/[\s_-]+/)
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ') ?? 'Unknown';

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${toneFromStatus(
        value ?? '',
      )}`}
    >
      {label}
    </span>
  );
}

interface QueryStatusPaneProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function LoadingState({
  title = 'Loading seeded data',
  description = 'The page is fetching the Phase 1 dataset from the backend.',
}: Partial<QueryStatusPaneProps>) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[32px] border border-dashed border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
      <div className="rounded-full bg-indigo-50 p-5 text-indigo-600">
        <LoaderCircle size={28} className="animate-spin" />
      </div>
      <div className="space-y-2">
        <div className="text-lg font-bold text-slate-900">{title}</div>
        <div className="max-w-2xl text-sm leading-6 text-slate-500">{description}</div>
      </div>
    </div>
  );
}

export function ErrorState({
  title = 'Unable to load seeded data',
  description,
  action,
}: QueryStatusPaneProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[32px] border border-dashed border-rose-200 bg-white px-6 py-20 text-center shadow-sm">
      <div className="rounded-full bg-rose-50 p-5 text-rose-600">
        <AlertCircle size={28} />
      </div>
      <div className="space-y-2">
        <div className="text-lg font-bold text-slate-900">{title}</div>
        <div className="max-w-2xl text-sm leading-6 text-slate-500">{description}</div>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: QueryStatusPaneProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[32px] border border-dashed border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
      <div className="rounded-full bg-slate-100 p-5 text-slate-500">
        <Icon size={28} />
      </div>
      <div className="space-y-2">
        <div className="text-lg font-bold text-slate-900">{title}</div>
        <div className="max-w-2xl text-sm leading-6 text-slate-500">{description}</div>
      </div>
      {action}
    </div>
  );
}

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function SearchField({ value, onChange, placeholder }: SearchFieldProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
      />
    </div>
  );
}

interface TabItem {
  id: string;
  label: string;
  helper?: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function TabBar({ tabs, activeId, onChange }: TabBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              isActive
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="text-sm font-bold">{tab.label}</div>
            {tab.helper ? (
              <div className={`mt-1 text-xs ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                {tab.helper}
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
