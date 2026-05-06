import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { usePages } from './hooks/usePages';
import { useTelegramSession } from './hooks/useTelegramSession';
import { AppShellSkeleton } from './components/skeletons';
import { AppShell } from './layout/AppShell';
import { AccessOnlyPage } from './pages/AccessOnlyPage';
import { EditProposalPage } from './pages/EditProposalPage';
import { HomePage } from './pages/HomePage';
import { NewProposalPage } from './pages/NewProposalPage';
import { ProposalPage } from './pages/ProposalPage';
import { PublicProposalPage } from './pages/PublicProposalPage';
import { SharePage } from './pages/SharePage';

export default function App() {
  const { status, user } = useTelegramSession();
  const location = useLocation();
  const isPublicPath = location.pathname === '/p' || location.pathname.startsWith('/p/');
  const telegramId = user ? String(user.id) : null;
  const { pages, isLoading, error, createPage, updatePage } = usePages(telegramId);

  if (isPublicPath) {
    return (
      <Routes location={location}>
        <Route path="/p/:pageId" element={<PublicProposalPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  if (status === 'checking') {
    return <AppShellSkeleton />;
  }

  if (status === 'blocked' || !user) {
    return <AccessOnlyPage />;
  }

  return (
    <AppShell user={user}>
      <Routes location={location}>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<HomePage pages={pages} isLoading={isLoading} error={error} />} />
        <Route path="/admin/new" element={<NewProposalPage onSave={createPage} />} />
        <Route path="/admin/proposal" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/proposal/:pageId" element={<ProposalPage />} />
        <Route path="/admin/edit" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/edit/:pageId" element={<EditProposalPage onSave={updatePage} />} />
        <Route path="/admin/share" element={<SharePage pages={pages} isLoading={isLoading} error={error} />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AppShell>
  );
}
