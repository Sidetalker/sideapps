'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { InteractiveDataTable } from '@/components/data-table/InteractiveDataTable';
import type { ColumnConfig } from '@/components/data-table/InteractiveDataTable';
import type { SiteSummary } from '@/data/arcgis';
import { getCategoryOptions, getRegionOptions, getStatusOptions } from '@/data/arcgis';
import { formatDateLabel } from '@/utils/formatDate';

interface MainSiteTableProps {
  sites: SiteSummary[];
}

function matchesFilter(value: string, selectedValues: string[]): boolean {
  if (selectedValues.length === 0) {
    return true;
  }
  return selectedValues.includes(value);
}

function useArcgisColumns(): ColumnConfig<SiteSummary>[] {
  return useMemo(() => {
    const columns: ColumnConfig<SiteSummary>[] = [
      {
        id: 'name',
        header: 'Site',
        accessor: (site) => (
          <div className="flex flex-col">
            <Link
              href={`/arcgis/${site.id}`}
              className="font-semibold text-orange-200 transition hover:text-orange-100"
            >
              {site.name}
            </Link>
            <span className="text-xs text-slate-400">{site.jurisdiction}</span>
          </div>
        ),
        getValue: (site) => site.name,
        filterPlaceholder: 'Search site name',
      },
      {
        id: 'category',
        header: 'Category',
        accessor: (site) => site.category,
        getValue: (site) => site.category,
      },
      {
        id: 'status',
        header: 'Status',
        accessor: (site) => site.status,
        getValue: (site) => site.status,
      },
      {
        id: 'region',
        header: 'Region',
        accessor: (site) => site.region,
        getValue: (site) => site.region,
      },
      {
        id: 'assetCount',
        header: 'Assets',
        accessor: (site) => (
          <span className="font-semibold text-slate-100">{site.assetCount}</span>
        ),
        getValue: (site) => String(site.assetCount),
        cellClassName: 'text-right',
        headerClassName: 'text-right',
      },
      {
        id: 'lastUpdated',
        header: 'Updated',
        accessor: (site) => (
          <span className="text-sm text-slate-300">{formatDateLabel(site.lastUpdated)}</span>
        ),
        getValue: (site) => site.lastUpdated,
      },
    ];

    return columns;
  }, []);
}

interface FilterGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  onClear: () => void;
}

function FilterGroup({ label, options, selected, onToggle, onClear }: FilterGroupProps) {
  return (
    <fieldset className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex items-center justify-between">
        <legend className="text-sm font-semibold text-slate-100">{label}</legend>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-semibold text-slate-400 transition hover:text-white"
        >
          Clear
        </button>
      </div>
      <div className="space-y-2">
        {options.map((option) => {
          const inputId = `${label}-${option}`.replace(/\s+/g, '-').toLowerCase();
          const isActive = selected.includes(option);
          return (
            <label
              key={option}
              htmlFor={inputId}
              className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                isActive
                  ? 'border-orange-400 bg-orange-400/10 text-orange-100'
                  : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <span>{option}</span>
              <input
                id={inputId}
                type="checkbox"
                checked={isActive}
                onChange={() => onToggle(option)}
                className="h-4 w-4 rounded border-slate-500 text-orange-400 focus:ring-orange-300"
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function MainSiteTable({ sites }: MainSiteTableProps) {
  const columns = useArcgisColumns();
  const statusOptions = useMemo(() => getStatusOptions(), []);
  const regionOptions = useMemo(() => getRegionOptions(), []);
  const categoryOptions = useMemo(() => getCategoryOptions(), []);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredSites = useMemo(() => {
    return sites.filter((site) =>
      matchesFilter(site.status, selectedStatuses) &&
      matchesFilter(site.region, selectedRegions) &&
      matchesFilter(site.category, selectedCategories),
    );
  }, [selectedCategories, selectedRegions, selectedStatuses, sites]);

  const toggleStatus = (value: string) => {
    setSelectedStatuses((previous) =>
      previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value],
    );
  };

  const toggleRegion = (value: string) => {
    setSelectedRegions((previous) =>
      previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value],
    );
  };

  const toggleCategory = (value: string) => {
    setSelectedCategories((previous) =>
      previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value],
    );
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <aside className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-100">Main Filters</h2>
        <p className="text-sm text-slate-400">
          Narrow down the dataset using the filters below. Column filters in the table can be applied on top of these selections.
        </p>
        <FilterGroup
          label="Status"
          options={statusOptions}
          selected={selectedStatuses}
          onToggle={toggleStatus}
          onClear={() => setSelectedStatuses([])}
        />
        <FilterGroup
          label="Region"
          options={regionOptions}
          selected={selectedRegions}
          onToggle={toggleRegion}
          onClear={() => setSelectedRegions([])}
        />
        <FilterGroup
          label="Category"
          options={categoryOptions}
          selected={selectedCategories}
          onToggle={toggleCategory}
          onClear={() => setSelectedCategories([])}
        />
      </aside>
      <section className="space-y-4">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">Infrastructure Overview</h1>
          <p className="text-sm text-slate-400">
            Drag column handles to reorganize, apply fuzzy filters from any header, and hide columns you don&apos;t need. Hidden columns
            appear above the table so you can quickly add them back.
          </p>
        </header>
        <InteractiveDataTable
          columns={columns}
          data={filteredSites}
          getRowKey={(row) => row.id}
          emptyMessage="No sites match the current filters. Adjust the sidebar or column filters to broaden your results."
        />
      </section>
    </div>
  );
}
