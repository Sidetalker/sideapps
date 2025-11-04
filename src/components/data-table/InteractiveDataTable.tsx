'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export interface ColumnConfig<TData> {
  id: string;
  header: string;
  accessor: (row: TData) => ReactNode;
  getValue?: (row: TData) => string | number | null | undefined;
  filterPlaceholder?: string;
  enableHiding?: boolean;
  headerClassName?: string;
  cellClassName?: string;
}

interface InteractiveDataTableProps<TData> {
  columns: ColumnConfig<TData>[];
  data: TData[];
  getRowKey?: (row: TData, index: number) => string | number;
  emptyMessage?: string;
}

type DragState = {
  dragging: string | null;
  over: string | null;
};

const defaultDragState: DragState = { dragging: null, over: null };

function fuzzyMatch(source: string, query: string): boolean {
  const normalizedSource = source.toLowerCase();
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  if (normalizedSource.includes(normalizedQuery)) {
    return true;
  }

  let sourceIndex = 0;
  for (const char of normalizedQuery) {
    sourceIndex = normalizedSource.indexOf(char, sourceIndex);
    if (sourceIndex === -1) {
      return false;
    }
    sourceIndex += 1;
  }

  return true;
}

function extractPrimitive(node: ReactNode): string | number | null {
  if (node === null || node === undefined) {
    return null;
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return node;
  }

  return null;
}

export function InteractiveDataTable<TData>({
  columns,
  data,
  getRowKey,
  emptyMessage = 'No records match your filters.',
}: InteractiveDataTableProps<TData>) {
  const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map((column) => column.id));
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const dragColumnRef = useRef<string | null>(null);
  const [dragState, setDragState] = useState<DragState>(defaultDragState);

  useEffect(() => {
    setColumnOrder((previousOrder) => {
      const nextOrder = columns.map((column) => column.id);
      if (previousOrder.length === 0) {
        return nextOrder;
      }

      const sanitizedOrder = previousOrder.filter((columnId) => nextOrder.includes(columnId));
      const missingColumns = nextOrder.filter((columnId) => !sanitizedOrder.includes(columnId));

      if (missingColumns.length === 0 && sanitizedOrder.length === nextOrder.length) {
        return sanitizedOrder;
      }

      return [...sanitizedOrder, ...missingColumns];
    });

    setHiddenColumns((previousHidden) => previousHidden.filter((columnId) => columns.some((column) => column.id === columnId)));

    setColumnFilters((previousFilters) => {
      const nextFilters: Record<string, string> = {};
      columns.forEach((column) => {
        if (previousFilters[column.id]) {
          nextFilters[column.id] = previousFilters[column.id];
        }
      });
      return nextFilters;
    });
  }, [columns]);

  const columnMap = useMemo(() => {
    const mapping = new Map<string, ColumnConfig<TData>>();
    columns.forEach((column) => mapping.set(column.id, column));
    return mapping;
  }, [columns]);

  const orderedColumns = useMemo(() => {
    const resolvedColumns: ColumnConfig<TData>[] = [];
    columnOrder.forEach((columnId) => {
      const column = columnMap.get(columnId);
      if (column) {
        resolvedColumns.push(column);
      }
    });
    return resolvedColumns;
  }, [columnMap, columnOrder]);

  const visibleColumns = orderedColumns.filter((column) => !hiddenColumns.includes(column.id));
  const hiddenColumnDefs = orderedColumns.filter((column) => hiddenColumns.includes(column.id));

  const filteredRows = useMemo(() => {
    if (Object.keys(columnFilters).length === 0) {
      return data;
    }

    return data.filter((row) =>
      Object.entries(columnFilters).every(([columnId, filterValue]) => {
        const column = columnMap.get(columnId);
        if (!column) {
          return true;
        }

        const preparedFilter = filterValue.trim();
        if (!preparedFilter) {
          return true;
        }

        const value = column.getValue ? column.getValue(row) : extractPrimitive(column.accessor(row));
        if (value === null || value === undefined) {
          return false;
        }

        return fuzzyMatch(String(value), preparedFilter);
      }),
    );
  }, [columnFilters, columnMap, data]);

  const clearColumnFilters = () => setColumnFilters({});
  const showAllColumns = () => setHiddenColumns([]);

  const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, columnId: string) => {
    dragColumnRef.current = columnId;
    setDragState({ dragging: columnId, over: null });
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', columnId);
  };

  const handleDragEnd = () => {
    dragColumnRef.current = null;
    setDragState(defaultDragState);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLTableCellElement>, targetColumnId: string) => {
    event.preventDefault();
    if (!dragColumnRef.current || dragColumnRef.current === targetColumnId) {
      setDragState((current) => ({ ...current, over: null }));
      return;
    }
    setDragState((current) =>
      current.over === targetColumnId ? current : { dragging: current.dragging, over: targetColumnId },
    );
  };

  const handleDragLeave = (event: React.DragEvent<HTMLTableCellElement>, targetColumnId: string) => {
    event.preventDefault();
    setDragState((current) => (current.over === targetColumnId ? { ...current, over: null } : current));
  };

  const handleDrop = (event: React.DragEvent<HTMLTableCellElement>, targetColumnId: string) => {
    event.preventDefault();
    const sourceId = dragColumnRef.current ?? event.dataTransfer.getData('text/plain');
    dragColumnRef.current = null;
    setDragState(defaultDragState);

    if (!sourceId || sourceId === targetColumnId) {
      return;
    }

    setColumnOrder((previousOrder) => {
      const sourceIndex = previousOrder.indexOf(sourceId);
      const targetIndex = previousOrder.indexOf(targetColumnId);

      if (sourceIndex === -1 || targetIndex === -1) {
        return previousOrder;
      }

      const nextOrder = [...previousOrder];
      nextOrder.splice(sourceIndex, 1);
      nextOrder.splice(targetIndex, 0, sourceId);
      return nextOrder;
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLTableCellElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const toggleColumnVisibility = (columnId: string) => {
    setHiddenColumns((previousHidden) =>
      previousHidden.includes(columnId)
        ? previousHidden.filter((hiddenId) => hiddenId !== columnId)
        : [...previousHidden, columnId],
    );
  };

  const updateFilterValue = (columnId: string, value: string) => {
    setColumnFilters((previousFilters) => {
      if (!value.trim()) {
        if (!(columnId in previousFilters)) {
          return previousFilters;
        }
        const nextFilters = { ...previousFilters };
        delete nextFilters[columnId];
        return nextFilters;
      }
      return { ...previousFilters, [columnId]: value };
    });
  };

  const activeFilterCount = Object.keys(columnFilters).length;
  const visibleColumnCount = visibleColumns.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-300">
          Showing <span className="font-medium text-white">{filteredRows.length}</span> of{' '}
          <span className="font-medium text-white">{data.length}</span> records
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearColumnFilters}
              className="rounded-full border border-slate-500 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-slate-400 hover:text-white"
            >
              Clear column filters ({activeFilterCount})
            </button>
          )}
          {hiddenColumnDefs.length > 0 && (
            <button
              type="button"
              onClick={showAllColumns}
              className="rounded-full border border-slate-500 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-slate-400 hover:text-white"
            >
              Show all columns
            </button>
          )}
        </div>
      </div>

      {hiddenColumnDefs.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-300">
          <span className="font-semibold uppercase tracking-wide text-slate-400">Hidden columns:</span>
          {hiddenColumnDefs.map((column) => (
            <button
              key={column.id}
              type="button"
              onClick={() => toggleColumnVisibility(column.id)}
              className="rounded-full bg-slate-700/70 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:bg-slate-600/80"
            >
              {column.header}
              <span className="ml-2 text-slate-300">+</span>
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 shadow-inner">
        <table className="min-w-full divide-y divide-slate-800 text-left">
          <thead>
            <tr>
              {visibleColumns.map((column) => {
                const isDropTarget = dragState.over === column.id;
                const isDragging = dragState.dragging === column.id;
                return (
                  <th
                    key={column.id}
                    onDragEnter={(event) => handleDragEnter(event, column.id)}
                    onDragOver={handleDragOver}
                    onDragLeave={(event) => handleDragLeave(event, column.id)}
                    onDrop={(event) => handleDrop(event, column.id)}
                    scope="col"
                    className={`border-b border-slate-800 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-200 transition ${
                      isDropTarget ? 'bg-slate-800/70' : 'bg-slate-900/50'
                    } ${isDragging ? 'opacity-70' : ''} ${column.headerClassName ?? ''}`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          aria-label={`Reorder column ${column.header}`}
                          draggable
                          onDragStart={(event) => handleDragStart(event, column.id)}
                          onDragEnd={handleDragEnd}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-transparent text-slate-400 transition hover:border-slate-600 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                        >
                          <span aria-hidden className="text-base leading-none">⋮⋮</span>
                        </button>
                        <span className="flex-1 text-sm font-semibold text-slate-100">{column.header}</span>
                        {column.enableHiding !== false && (
                          <button
                            type="button"
                            onClick={() => toggleColumnVisibility(column.id)}
                            className="text-xs font-medium text-orange-300 transition hover:text-orange-200"
                          >
                            Hide
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          value={columnFilters[column.id] ?? ''}
                          onChange={(event) => updateFilterValue(column.id, event.target.value)}
                          placeholder={column.filterPlaceholder ?? `Filter ${column.header}`}
                          className="h-8 w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                        />
                        {columnFilters[column.id] && (
                          <button
                            type="button"
                            onClick={() => updateFilterValue(column.id, '')}
                            className="text-xs font-semibold text-slate-300 transition hover:text-white"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60">
            {visibleColumnCount === 0 ? (
              <tr>
                <td colSpan={orderedColumns.length || 1} className="px-4 py-6 text-center text-sm text-slate-300">
                  All columns are hidden. Use the controls above to restore a column.
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan={visibleColumnCount} className="px-4 py-6 text-center text-sm text-slate-300">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredRows.map((row, index) => {
                const key = getRowKey ? getRowKey(row, index) : index;
                return (
                  <tr key={key} className="transition hover:bg-slate-900/60">
                    {visibleColumns.map((column) => (
                      <td
                        key={column.id}
                        className={`px-4 py-3 text-sm text-slate-200 ${column.cellClassName ?? ''}`.trim()}
                      >
                        {column.accessor(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
