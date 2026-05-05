import React from 'react';

interface SectionSwitcherItem<T extends string> {
  id: T;
  label: string;
  description: string;
  icon: React.ElementType;
}

interface SectionSwitcherProps<T extends string> {
  items: SectionSwitcherItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  columnsClassName?: string;
}

export default function SectionSwitcher<T extends string>({
  items,
  activeId,
  onChange,
  columnsClassName = 'md:grid-cols-3',
}: SectionSwitcherProps<T>) {
  return (
    <div className={`grid grid-cols-1 gap-3 ${columnsClassName}`}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === activeId;

        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              isActive
                ? 'border-indigo-200 bg-indigo-50 shadow-sm shadow-indigo-100'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 rounded-xl p-2 ${
                  isActive ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-bold ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>
                  {item.label}
                </div>
                <p className={`mt-1 text-xs leading-relaxed ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>
                  {item.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
