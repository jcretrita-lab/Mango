import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ApiPage } from '../../hooks/useQueries';

interface PaginationControlsProps {
  page: ApiPage;
  noun: string;
  onPageChange: (page: number) => void;
}

function getTotalPages(page: ApiPage): number {
  return Math.max(1, Math.ceil(page.total / Math.max(page.limit, 1)));
}

function getPageWindow(currentPage: number, totalPages: number): number[] {
  const start = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
  const end = Math.min(totalPages, start + 2);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function PaginationControls({
  page,
  noun,
  onPageChange,
}: PaginationControlsProps) {
  const totalPages = getTotalPages(page);
  const currentPage = Math.min(page.page, totalPages);
  const firstRow = page.total === 0 ? 0 : (currentPage - 1) * page.limit + 1;
  const lastRow = Math.min(currentPage * page.limit, page.total);
  const pageNumbers = getPageWindow(currentPage, totalPages);

  return (
    <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
        Showing {firstRow} to {lastRow} of {page.total} {noun}
      </p>
      <div className="flex items-center gap-2">
        <button
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition-all hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                pageNumber === currentPage
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                  : 'text-slate-500 hover:bg-white hover:shadow-sm'
              }`}
              onClick={() => onPageChange(pageNumber)}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          ))}
        </div>
        <button
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition-all hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
