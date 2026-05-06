import type { ReactNode } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserBadge } from '../components/ui';
import type { TelegramUser } from '../types';

export function AppShell({ user, children }: { user: TelegramUser; children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname.startsWith('/admin/') && location.pathname !== '/admin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 pt-4 xl:px-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className={`grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-200 active:scale-95 ${
              showBack ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-75 opacity-0 hidden'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <Link
            to="/admin"
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 transition-transform active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-blue-600" />
            Didar
          </Link>
        </div>
        <UserBadge user={user} />
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-4 xl:px-8">{children}</main>
    </div>
  );
}
