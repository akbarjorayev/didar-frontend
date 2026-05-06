import { LockKeyhole } from 'lucide-react';
import { FaTelegram } from 'react-icons/fa6';

const BOT_URL = 'https://t.me/whatfhappeningonearthhuhfuck_bot';

export function AccessOnlyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          <LockKeyhole className="h-3.5 w-3.5" />
          Telegram Required
        </div>
        <h1 className="text-xl font-bold tracking-tight">Access only via Telegram</h1>
        <p className="mt-2 text-sm text-slate-600">This panel is locked to Telegram Mini Apps. Open it from inside Telegram to continue.</p>
        <a
          href={BOT_URL}
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white transition-transform active:scale-95"
        >
          <FaTelegram className="h-4 w-4" />
          Open Telegram Bot
        </a>
      </div>
    </div>
  );
}
