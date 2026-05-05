import React, { useMemo } from 'react';
import {
  ErrorState,
  LoadingState,
  PageHeader,
  StatusBadge,
} from '../../components/phase1/Phase1Ui';
import {
  type RankRecord,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useApiQueries } from '../../hooks/useQueries';
import { MiniMetric } from './components/SettingsUi';

export default function RankSettingsPage() {
  usePageTitle('Ranks');

  const { status, data, errorMessage, refresh } = useApiQueries({
    ranks: '/org-structure/ranks',
    rankLevels: '/org-structure/rank-levels',
    positionProfiles: '/org-structure/position-profiles',
    positions: '/org-structure/positions',
  });

  const cards = useMemo(() => {
    const ranks = data.ranks as RankRecord[];
    const rankLevels = data.rankLevels as Array<{ id: number; rankId: number; code: string; sortOrder: number }>;
    const positionProfiles = data.positionProfiles as Array<{ id: number; rankId?: number | null; label: string }>;
    const positions = data.positions as Array<{ id: number; positionProfileId: number }>;

    return ranks.map((rank) => {
      const levels = rankLevels.filter((level) => level.rankId === rank.id);
      const profileIds = positionProfiles.filter((profile) => profile.rankId === rank.id).map((profile) => profile.id);
      const livePositions = positions.filter((position) => profileIds.includes(position.positionProfileId)).length;

      return { rank, levels, livePositions, profileCount: profileIds.length };
    });
  }, [data]);

  if (status === 'loading') {
    return <LoadingState description="Loading seeded ranks, levels, and linked position-profile coverage." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Rank settings are unavailable"
        description={errorMessage ?? 'The ranks page could not reach the backend.'}
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

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Org Structure"
        title="Ranks"
        description="The job architecture page now reads the seeded rank and sub-rank structure directly from the backend."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ rank, levels, livePositions, profileCount }) => (
          <div key={rank.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-bold text-slate-900">{rank.name}</div>
              <StatusBadge value={rank.mode} />
            </div>
            <div className="mt-4 grid gap-3">
              <MiniMetric label="Levels" value={String(levels.length)} />
              <MiniMetric label="Profiles" value={String(profileCount)} />
              <MiniMetric label="Positions" value={String(livePositions)} />
            </div>
            <div className="mt-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Rank Levels</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {levels.length ? (
                  levels.map((level) => (
                    <span key={level.id} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      {level.code}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">No sub-levels configured</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
