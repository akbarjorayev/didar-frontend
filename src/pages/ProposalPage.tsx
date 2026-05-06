import { PencilLine, Share2 } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { PageCardSkeleton } from '../components/skeletons';
import { PrimaryButton, SecondaryButton } from '../components/ui';
import { usePageView } from '../hooks/usePageView';

export function ProposalPage() {
  const navigate = useNavigate();
  const { pageId } = useParams();
  const { page, isLoading, error } = usePageView(pageId);

  if (!pageId) {
    return <Navigate to="/admin" replace />;
  }

  if (isLoading) {
    return <PageCardSkeleton />;
  }

  if (error || !page) {
    return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">{error || 'Page not found'}</div>;
  }

  const createdLabel = page.answeredAt
    ? new Date(page.answeredAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <section className="space-y-3 xl:max-w-4xl">
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div>
          <div className="text-xs font-medium text-slate-500">{page.canSubmit ? 'Open page' : 'Closed page'}{createdLabel ? ` • ${createdLabel}` : ''}</div>
          <div className="mt-2 text-sm font-semibold text-slate-900">{page.title || 'Untitled page'}</div>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-900">{page.question || 'No question available.'}</p>
        </div>

        {!page.canSubmit ? (
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-3.5 text-sm text-slate-700">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Final answer</span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  page.finalAnswer === 'YES'
                    ? 'bg-emerald-100 text-emerald-700'
                    : page.finalAnswer === 'NO'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-200 text-slate-700'
                }`}
              >
                {page.finalAnswer ?? 'Unknown'}
              </span>
            </div>
            {page.finalComment ? <div className="mt-2 whitespace-pre-wrap rounded-xl bg-white/80 p-2.5 text-xs text-slate-700">{page.finalComment}</div> : null}
          </div>
        ) : null}
      </div>

      <div className="flex gap-2">
        {page.canSubmit ? (
          <SecondaryButton className="flex-1" onClick={() => navigate(`/admin/edit/${page.id}`)}>
            <PencilLine className="h-4 w-4" />
            Edit
          </SecondaryButton>
        ) : null}
        <PrimaryButton className="flex-1" onClick={() => navigate(`/admin/share?id=${page.id}`)}>
          <Share2 className="h-4 w-4" />
          Share
        </PrimaryButton>
      </div>
    </section>
  );
}
