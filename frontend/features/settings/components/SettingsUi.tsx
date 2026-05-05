import React from 'react';

export function ChipRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {values.length ? (
          values.map((v, i) => (
            <span
              key={i}
              className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"
            >
              {v}
            </span>
          ))
        ) : (
          <span className="text-[10px] italic text-slate-400">None</span>
        )}
      </div>
    </div>
  );
}

export function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-bold text-slate-700">{value}</div>
    </div>
  );
}
