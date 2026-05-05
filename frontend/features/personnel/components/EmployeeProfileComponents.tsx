import React from 'react';
import { LucideIcon } from 'lucide-react';
import { StatusBadge } from '../../../components/phase1/Phase1Ui';

export function HeaderMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3 text-left">
      <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <Icon size={13} />
        {label}
      </div>
      <div className="truncate text-xs font-bold text-slate-800">{value}</div>
    </div>
  );
}

export function InfoGrid({ items }: { items: Array<[string, string | null | undefined]> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</div>
          <div className="mt-2 text-sm font-semibold leading-6 text-slate-800">{value || '—'}</div>
        </div>
      ))}
    </div>
  );
}

export function SubList({
  title,
  emptyLabel,
  items,
}: {
  title: string;
  emptyLabel: string;
  items: Array<{ title: string; subtitle: string; detail: string }>;
}) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-bold text-slate-900">{title}</div>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        items.map((item, index) => (
          <div key={`${item.title}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
            <div className="text-sm font-bold text-slate-900">{item.title}</div>
            <div className="mt-1 text-xs font-semibold text-slate-500">{item.subtitle}</div>
            <div className="mt-2 text-sm text-slate-600">{item.detail}</div>
          </div>
        ))
      )}
    </div>
  );
}

export function RecordTable({
  columns,
  rows,
  emptyLabel,
}: {
  columns: string[];
  rows: (string | React.ReactNode)[][];
  emptyLabel: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50/80">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((value, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-sm text-slate-600">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
