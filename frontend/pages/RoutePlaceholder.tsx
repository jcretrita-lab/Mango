import React from 'react';
import { AlertCircle, Clock3, Database, Inbox, Link2, LoaderCircle, Sparkles } from 'lucide-react';
import type { RoutePhase, RoutePreview } from '../config/appShellRoutes';
import { useRoutePreview } from '../hooks/useRoutePreview';

interface RoutePlaceholderProps {
  title: string;
  description: string;
  contextLabel?: string;
  phase?: RoutePhase;
  preview?: RoutePreview;
}

function toSentenceCase(value: string): string {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .replace(/^./, (character) => character.toUpperCase());
}

const RoutePlaceholder: React.FC<RoutePlaceholderProps> = ({
  title,
  description,
  contextLabel,
  phase = 'phase1',
  preview,
}) => {
  const previewState = useRoutePreview(phase === 'phase1' ? preview : undefined);
  const hasLivePreview = previewState.status === 'success' && previewState.results.some((result) => result.count > 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {contextLabel ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-700">
                <Link2 size={12} />
                {contextLabel}
              </div>
            ) : null}
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                phase === 'phase1'
                  ? 'border border-emerald-100 bg-emerald-50 text-emerald-700'
                  : 'border border-amber-100 bg-amber-50 text-amber-700'
              }`}
            >
              {phase === 'phase1' ? <Sparkles size={12} /> : <Clock3 size={12} />}
              {phase === 'phase1' ? 'Phase 1 Active' : 'Later Phase'}
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
            <p className="max-w-3xl text-sm font-medium leading-6 text-slate-500">{description}</p>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <Database size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-900">
                {phase === 'phase1' ? 'Seed Data Preview' : 'Planned Module'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {phase === 'phase1'
                  ? preview?.summary ?? 'This route can preview live Phase 1 seed data when the backend is running.'
                  : 'This screen stays in a deliberate empty state until the later-phase backend module is mounted.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-8 py-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 p-6">
            {phase !== 'phase1' ? (
              <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <div className="rounded-full bg-amber-50 p-5 text-amber-600">
                  <Clock3 size={28} />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-bold text-slate-900">Not part of the mounted Phase 1 backend</p>
                  <p className="max-w-xl text-sm leading-6 text-slate-500">
                    The page shell is preserved, but this module is intentionally deferred so the current product reflects the real Phase 1 scope.
                  </p>
                </div>
              </div>
            ) : previewState.status === 'loading' ? (
              <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <div className="rounded-full bg-indigo-50 p-5 text-indigo-600">
                  <LoaderCircle size={28} className="animate-spin" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-bold text-slate-900">Loading Phase 1 preview</p>
                  <p className="max-w-xl text-sm leading-6 text-slate-500">
                    The shell is querying the seeded backend resources for a live preview of this route.
                  </p>
                </div>
              </div>
            ) : previewState.status === 'error' ? (
              <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <div className="rounded-full bg-rose-50 p-5 text-rose-600">
                  <AlertCircle size={28} />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-bold text-slate-900">Preview unavailable</p>
                  <p className="max-w-xl text-sm leading-6 text-slate-500">
                    {previewState.errorMessage ?? 'The route will fall back to its empty state until the backend is reachable.'}
                  </p>
                </div>
              </div>
            ) : hasLivePreview ? (
              <div className="space-y-4">
                {previewState.results.map((result) => (
                  <div key={result.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{result.label}</p>
                        <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">{result.count}</p>
                      </div>
                      <div className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                        Live Seed Snapshot
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {result.samples.length > 0 ? (
                        result.samples.map((sample, index) => (
                          <div key={`${result.label}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <div className="grid gap-2 md:grid-cols-2">
                              {Object.entries(sample).map(([field, value]) => (
                                <div key={`${field}-${value}`}>
                                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                    {toSentenceCase(field)}
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
                          No records returned from this resource yet.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <div className="rounded-full bg-indigo-50 p-5 text-indigo-600">
                  <Inbox size={28} />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-bold text-slate-900">No records loaded yet</p>
                  <p className="max-w-xl text-sm leading-6 text-slate-500">
                    This page still has a proper empty state. Once the matching Phase 1 resource returns rows, the preview cards will populate here.
                  </p>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Integration status</p>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                {phase === 'phase1' ? 'Connected to Phase 1 scope' : 'Deferred beyond Phase 1'}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {phase === 'phase1'
                  ? 'This route keeps its final shell while allowing live seeded previews, empty states, and backend-failure fallback.'
                  : 'The route shell stays available, but the business module is intentionally deferred until the matching backend exists.'}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Fallback behavior</p>
              <p className="mt-3 text-sm font-semibold text-slate-900">Empty state preserved</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Even with live previews enabled, the route still degrades cleanly when the backend is offline, data is missing, or the page is outside the current release scope.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default RoutePlaceholder;
