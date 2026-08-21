import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
  
} from '@tanstack/react-table';
import type {SortingState} from '@tanstack/react-table';
import { cn } from '@gavikina/ui';
import { LEADS, TODAY, rowsForView, ts, viewInfo } from '../lib/data';
import type {Lead} from '../lib/data';
import { csvFor, download, summaryOf, tagColors } from '../lib/utils';

const TYPE_FILTERS = ['All types', 'Customer', 'Agent', 'Investor', 'Career', 'Contact'];
const columnHelper = createColumnHelper<Lead>();

const columns = [
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => {
      const [color, bg] = tagColors(info.getValue());
      return (
        <span className="inline-flex rounded-md px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider" style={{ color, background: bg }}>
          {info.getValue()}
        </span>
      );
    },
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => {
      const r = info.row.original;
      return (
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-[13.5px] font-medium">{r.name}</span>
          <span className="truncate text-[11.5px] text-navy/50">
            {r.type === 'Customer' ? (r.property || '') + ' · ' + (r.area || 'Area not given') : r.area || r.email || ''}
          </span>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: 'contact',
    header: 'Contact',
    cell: (info) => <span className="truncate text-[13px] text-navy/72">{info.row.original.phone || info.row.original.email || info.row.original.contact || 'Not captured'}</span>,
  }),
  columnHelper.display({
    id: 'summary',
    header: 'Summary',
    cell: (info) => <span className="truncate text-[13px] text-navy/72">{summaryOf(info.row.original)}</span>,
  }),
  columnHelper.accessor('when', {
    header: 'Received',
    cell: (info) => <span className="whitespace-nowrap text-[12.5px] tabular-nums text-navy/55">{info.getValue()}</span>,
    sortingFn: (a, b) => ts(a.original.when) - ts(b.original.when),
  }),
];

interface EnquiryTableProps {
  view: string;
}

export default function EnquiryTable({ view }: EnquiryTableProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All types');
  const [dateFilter, setDateFilter] = useState('All dates');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'when', desc: true }]);

  const unfiltered = useMemo(() => rowsForView(view), [view]);

  const dateOptions = useMemo(
    () =>
      ['All dates', 'Today', 'Yesterday', 'Last 3 days', 'Last 7 days'].concat(
        [...new Set(unfiltered.map((l) => Math.floor(ts(l.when) / 10000)))].sort((a, b) => b - a).map((d) => d + ' Aug')
      ),
    [unfiltered]
  );

  const rows = useMemo(() => {
    let list = unfiltered;
    if (view === 'all' && typeFilter !== 'All types') list = list.filter((l) => l.type === typeFilter);
    if (dateFilter !== 'All dates') {
      const day = (l: Lead) => Math.floor(ts(l.when) / 10000);
      if (dateFilter === 'Today') list = list.filter((l) => day(l) === TODAY);
      else if (dateFilter === 'Yesterday') list = list.filter((l) => day(l) === TODAY - 1);
      else if (dateFilter === 'Last 3 days') list = list.filter((l) => day(l) > TODAY - 3);
      else if (dateFilter === 'Last 7 days') list = list.filter((l) => day(l) > TODAY - 7);
      else {
        const d = parseInt(dateFilter, 10);
        list = list.filter((l) => day(l) === d);
      }
    }
    return list;
  }, [unfiltered, view, typeFilter, dateFilter]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, globalFilter: query },
    onSortingChange: setSorting,
    onGlobalFilterChange: setQuery,
    globalFilterFn: (row, _col, filterValue) => {
      const l = row.original;
      const q = String(filterValue).trim().toLowerCase();
      if (!q) return true;
      return [l.name, l.phone, l.email, l.area, l.size, l.occupation, l.role, l.property, l.reason, l.message, l.about]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const filteredRows = table.getRowModel().rows;
  const filtersActive = !!(query.trim() || typeFilter !== 'All types' || dateFilter !== 'All dates');
  const [title, note] = viewInfo(view);

  const clearFilters = () => {
    setQuery('');
    setTypeFilter('All types');
    setDateFilter('All dates');
  };

  return (
    <div className="animate-gv-fade">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[27px] font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-navy/58">{note}</p>
        </div>
        <button
          type="button"
          className="rounded-xl border border-navy/16 bg-white px-4 py-2.5 text-[13px] font-medium hover:bg-cream"
          onClick={() => download('gavikina-' + view + '.csv', csvFor(filteredRows.map((r) => r.original)))}
        >
          Download CSV
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-55 flex-1">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, email, area or size"
            className="w-full rounded-xl border border-navy/16 bg-white py-2.5 pl-9 pr-3 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-green/40"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy/40">⌕</span>
        </div>

        {view === 'all' && (
          <div className="flex flex-wrap gap-1.5">
            {TYPE_FILTERS.map((t) => {
              const count = t === 'All types' ? LEADS.length : LEADS.filter((l) => l.type === t).length;
              return (
                <button
                  key={t}
                  type="button"
                  className={cn(
                    'rounded-full border px-3.5 py-2 text-[12.5px] font-medium',
                    typeFilter === t ? 'border-green bg-green/8' : 'border-navy/14 bg-white'
                  )}
                  onClick={() => setTypeFilter(t)}
                >
                  {t === 'All types' ? 'All' : t === 'Career' ? 'Careers' : t + 's'}
                  <span className="ml-1.5 tabular-nums opacity-55">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="rounded-xl border border-navy/16 bg-white px-3 py-2.5 text-[13px]">
          {dateOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {filtersActive && (
          <button type="button" className="rounded-xl border border-navy/16 bg-white px-3.5 py-2.5 text-[13px]" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full min-w-175 border-collapse">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-navy/10">
                {hg.headers.map((h) => (
                  <th key={h.id} className="cursor-pointer select-none px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-navy/45" onClick={h.column.getToggleSortingHandler()}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {{ asc: ' ↑', desc: ' ↓' }[h.column.getIsSorted() as string] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr
                key={row.id}
                className="cursor-pointer border-b border-navy/6 last:border-b-0 hover:bg-cream/60"
                onClick={() => navigate({ to: '/enquiries/$view/$id', params: { view, id: row.original.id } })}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="max-w-70 px-4 py-3.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-navy/50">
                  {unfiltered.length === 0 ? 'Nothing in this view yet.' : 'No records match these filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3.5 text-[12.5px] text-navy/50">
        {filteredRows.length === unfiltered.length
          ? filteredRows.length + ' record' + (filteredRows.length === 1 ? '' : 's') + ' · click a row for the full detail'
          : 'Showing ' + filteredRows.length + ' of ' + unfiltered.length + ' records · CSV export follows the filters'}
      </p>
    </div>
  );
}
