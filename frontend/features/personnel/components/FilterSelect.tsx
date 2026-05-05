import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterSelectProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}

export function FilterSelect({
  icon: Icon,
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) {
  const activeOption = options.find((option) => option.value === value);

  return (
    <label className="relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50">
      <Icon size={16} />
      <span>{label}</span>
      {value !== 'all' && activeOption ? (
        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">
          {activeOption.label}
        </span>
      ) : null}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 cursor-pointer appearance-none rounded-xl border-none bg-transparent opacity-0"
        aria-label={label}
      >
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="text-slate-300" />
    </label>
  );
}
