import React, { useDeferredValue, useMemo, useState } from 'react';
import {
  Layers3,
  ShieldCheck,
  TableProperties,
  Users,
} from 'lucide-react';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  SearchField,
  StatCard,
} from '../../components/phase1/Phase1Ui';
import {
  type PisFieldOptionRecord,
  type PisFieldPolicyRecord,
  type PisFieldRecord,
  type PisTabRecord,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useApiQueries } from '../../hooks/useQueries';

export default function EmployeeFieldSettingsPage() {
  usePageTitle('Employee Tabs & Fields');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTabId, setSelectedTabId] = useState<number | null>(null);
  const deferredSearch = useDeferredValue(searchTerm);
  const { status, data, errorMessage, refresh } = useApiQueries({
    pisTabs: '/personnel/pis-tabs',
    pisFields: '/personnel/pis-fields',
    pisFieldOptions: '/personnel/pis-field-options',
    pisFieldPolicies: '/personnel/pis-field-policies',
  });

  const view = useMemo(() => {
    const pisTabs = (data.pisTabs as PisTabRecord[] ?? []).sort((left, right) => left.sortOrder - right.sortOrder);
    const pisFields = data.pisFields as PisFieldRecord[] ?? [];
    const pisFieldOptions = data.pisFieldOptions as PisFieldOptionRecord[] ?? [];
    const pisFieldPolicies = data.pisFieldPolicies as PisFieldPolicyRecord[] ?? [];

    const selectedTab = pisTabs.find((tab) => tab.id === selectedTabId) ?? pisTabs[0] ?? null;
    const fields = selectedTab
      ? pisFields
          .filter((field) => field.pisTabId === selectedTab.id)
          .filter((field) => {
            const query = deferredSearch.trim().toLowerCase();
            return (
              !query ||
              [field.label, field.code, field.dataType]
                .join(' ')
                .toLowerCase()
                .includes(query)
            );
          })
          .sort((left, right) => left.sortOrder - right.sortOrder)
      : [];

    return {
      pisTabs,
      selectedTab,
      fields,
      pisFieldOptions,
      pisFieldPolicies,
    };
  }, [data, deferredSearch, selectedTabId]);

  if (status === 'loading') {
    return <LoadingState description="Loading PIS tabs, fields, options, and visibility policies from the seeded personnel setup." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Employee fields are unavailable"
        description={errorMessage ?? 'The employee-fields page could not reach the backend.'}
        action={
          <button
            onClick={() => void refresh()}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Retry
          </button>
        }
      />
    );
  }

  if (!view.selectedTab) {
    return (
      <EmptyState
        title="No PIS tabs are available"
        description="The employee-fields shell still preserves an empty state when no seeded field configuration exists."
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Personnel Information System"
        title="Employee Tabs & Fields"
        description="The field-setup page now renders the seeded tab catalog, field definitions, dropdown options, and visibility or required rules."
        actions={<SearchField value={searchTerm} onChange={setSearchTerm} placeholder="Search fields in the selected tab" />}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Tabs" value={view.pisTabs.length} helper="Seeded employee tab groups" icon={Layers3} accent="indigo" />
        <StatCard label="Visible Fields" value={view.fields.length} helper="Filtered field count in selected tab" icon={TableProperties} accent="blue" />
        <StatCard label="Options" value={view.pisFieldOptions.length} helper="Dropdown option values" icon={ShieldCheck} accent="emerald" />
        <StatCard label="Policies" value={view.pisFieldPolicies.length} helper="Visibility and required rules" icon={Users} accent="amber" />
      </div>

      <div className="max-w-full overflow-hidden">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {view.pisTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTabId(tab.id)}
              className={`whitespace-nowrap rounded-2xl px-5 py-2.5 text-sm font-bold transition ${
                view.selectedTab?.id === tab.id
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/80">
            <tr>
              <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Field Label</th>
              <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Data Type</th>
              <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Configuration</th>
              <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Rules</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {view.fields.map((field) => {
              const options = view.pisFieldOptions.filter((opt) => opt.pisFieldId === field.id);
              const policies = view.pisFieldPolicies.filter((pol) => pol.pisFieldId === field.id);

              return (
                <tr key={field.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-slate-900">{field.label}</div>
                    <div className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">{field.code}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 uppercase">
                      {field.dataType}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {policies.some(p => p.isRequired) && (
                        <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">REQUIRED</span>
                      )}
                      {options.length > 0 && (
                        <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">{options.length} OPTIONS</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs text-slate-500 font-medium">
                      {policies.length > 0 ? `${policies.length} linked rules` : 'System default'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
