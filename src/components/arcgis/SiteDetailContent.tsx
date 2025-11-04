'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { InteractiveDataTable } from '@/components/data-table/InteractiveDataTable';
import type { ColumnConfig } from '@/components/data-table/InteractiveDataTable';
import type { SiteAsset, SiteDetail } from '@/data/arcgis';
import { formatDateLabel } from '@/utils/formatDate';

interface SiteDetailContentProps {
  site: SiteDetail;
}

export function SiteDetailContent({ site }: SiteDetailContentProps) {
  const assetColumns = useMemo<ColumnConfig<SiteAsset>[]>(
    () => [
      {
        id: 'name',
        header: 'Asset',
        accessor: (asset) => (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-100">{asset.name}</span>
            <span className="text-xs text-slate-400">{asset.owner}</span>
          </div>
        ),
        getValue: (asset) => asset.name,
        filterPlaceholder: 'Search asset name',
      },
      {
        id: 'type',
        header: 'Type',
        accessor: (asset) => asset.type,
        getValue: (asset) => asset.type,
      },
      {
        id: 'condition',
        header: 'Condition',
        accessor: (asset) => asset.condition,
        getValue: (asset) => asset.condition,
      },
      {
        id: 'lastInspection',
        header: 'Last Inspection',
        accessor: (asset) => formatDateLabel(asset.lastInspection),
        getValue: (asset) => asset.lastInspection,
      },
      {
        id: 'notes',
        header: 'Notes',
        accessor: (asset) => (
          <span className="text-sm text-slate-200">{asset.notes}</span>
        ),
        getValue: (asset) => asset.notes,
        enableHiding: true,
      },
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <Link
        href="/arcgis"
        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-200 transition hover:text-orange-100"
      >
        <span aria-hidden>←</span>
        Back to overview
      </Link>
      <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-semibold text-white">{site.name}</h1>
            <span className="rounded-full border border-orange-300/50 bg-orange-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-200">
              {site.status}
            </span>
          </div>
          <p className="text-sm text-slate-300">{site.description}</p>
        </header>
        <dl className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Jurisdiction</dt>
            <dd className="font-medium text-slate-100">{site.jurisdiction}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Region</dt>
            <dd className="font-medium text-slate-100">{site.region}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Category</dt>
            <dd className="font-medium text-slate-100">{site.category}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Last updated</dt>
            <dd className="font-medium text-slate-100">{formatDateLabel(site.lastUpdated)}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Total assets</dt>
            <dd className="font-medium text-slate-100">{site.assetCount}</dd>
          </div>
        </dl>
      </section>
      <section className="space-y-3">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold text-white">Asset roster</h2>
          <p className="text-sm text-slate-400">
            Reorder columns, apply fuzzy filters, or hide details to focus on the most relevant asset information for this site.
          </p>
        </header>
        <InteractiveDataTable
          columns={assetColumns}
          data={site.assets}
          getRowKey={(asset) => asset.id}
          emptyMessage="No assets recorded for this site yet."
        />
      </section>
    </div>
  );
}
