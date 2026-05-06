import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { PageEditor } from '../components/PageEditor';
import { PageCardSkeleton } from '../components/skeletons';
import { usePageView } from '../hooks/usePageView';
import type { PageDTO, PageEntity } from '../types';

export function EditProposalPage({
  onSave,
}: {
  onSave: (pageId: string, input: Partial<PageDTO>) => Promise<PageEntity>;
}) {
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

  if (!page.canSubmit) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">This page is already closed and cannot be edited.</div>;
  }

  return (
    <PageEditor
      title="Edit page"
      subtitle="Editing mode"
      initialValue={{
        title: page.title ?? '',
        question: page.question ?? '',
        yesMessage: page.yesMessage ?? '',
        noMessage: page.noMessage ?? '',
        responseToYes: page.responseToYes ?? '',
        responseToNo: page.responseToNo ?? '',
      }}
      saveText="Update"
      savingText="Updating..."
      onSave={async (input) => {
        const updatedPage = await onSave(pageId, input);
        navigate(`/admin/proposal/${updatedPage.id}`);
      }}
    />
  );
}
