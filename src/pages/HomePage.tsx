import { useNavigate } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';
import { FloatingActionButton, ProposalCard } from '../components/ui';
import { ListSkeleton } from '../components/skeletons';
import type { PageSummary } from '../types';

export function HomePage({
  pages,
  isLoading,
  error,
}: {
  pages: PageSummary[];
  isLoading: boolean;
  error: string | null;
}) {
  const navigate = useNavigate();

  return (
    <section className="space-y-3">
      <div className="pb-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Your proposals</h1>
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">{error}</div>
      ) : pages.length ? (
        <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {pages.map((page) => (
            <ProposalCard key={page.id} proposal={page} onClick={() => navigate(`/admin/proposal/${page.id}`)} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-700">
            <FolderOpen className="h-4 w-4" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">No pages yet</h2>
          <p className="mt-1 text-sm text-slate-600">Create the first page and keep the flow fast.</p>
        </div>
      )}

      <FloatingActionButton onClick={() => navigate('/admin/new')} />
    </section>
  );
}
