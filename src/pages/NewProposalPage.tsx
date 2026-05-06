import { useNavigate } from 'react-router-dom';
import { PageEditor } from '../components/PageEditor';
import type { PageFormValues } from '../types';

export function NewProposalPage({
  onSave,
}: {
  onSave: (input: PageFormValues) => Promise<{ id: string }>;
}) {
  const navigate = useNavigate();

  return (
    <PageEditor
      title="Write, preview, share"
      subtitle="Create page"
      initialValue={{
        title: '',
        question: '',
        yesMessage: 'Yes',
        noMessage: 'No',
        responseToYes: 'Thanks for saying yes.',
        responseToNo: 'Thanks for being honest.',
      }}
      saveText="Create"
      savingText="Creating..."
      onSave={async (input) => {
        const createdPage = await onSave(input);
        navigate(`/admin/share?id=${createdPage.id}`);
      }}
    />
  );
}
