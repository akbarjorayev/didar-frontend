import type { ReactNode } from 'react';
import { Check, ChevronRight, Plus } from 'lucide-react';
import type { PageSummary, TelegramUser } from '../types';

export function UserBadge({ user }: { user: TelegramUser }) {
  const initials = user.firstName.slice(0, 1).toUpperCase();

  return (
    <div className="flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-3">
      <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-blue-100 text-xs font-bold text-blue-700" aria-hidden="true">
        {user.photoUrl ? <img alt="" className="h-full w-full object-cover" src={user.photoUrl} /> : initials}
      </div>
      <div className="text-sm font-semibold text-slate-900">{user.firstName}</div>
    </div>
  );
}

export function ProposalCard({ proposal, onClick }: { proposal: PageSummary; onClick: () => void }) {
  const preview = proposal.title.trim() || 'Untitled page';
  const createdLabel = new Date(proposal.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const statusLabel = proposal.closed ? 'Closed' : 'Open';

  return (
    <button
      className="flex w-full items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left transition-transform active:scale-[0.99]"
      onClick={onClick}
      type="button"
    >
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-900">{preview}</div>
        <div className="mt-0.5 text-xs text-slate-500">{createdLabel}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`rounded-full px-2 py-1 text-[10px] font-semibold ${proposal.closed ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-700'}`}>
          {statusLabel}
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
      </div>
    </button>
  );
}

export function FloatingActionButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="fixed bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-blue-600 text-white shadow-md transition-transform active:scale-95"
      onClick={onClick}
      type="button"
      aria-label="Create proposal"
    >
      <Plus className="h-5 w-5" />
    </button>
  );
}

export function ToggleSwitch({
  value,
  onChange,
  disabled = false,
}: {
  value: 'edit' | 'preview';
  onChange: (nextValue: 'edit' | 'preview') => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`relative grid w-full max-w-[220px] grid-cols-2 rounded-2xl border border-slate-200 bg-white p-1 ${disabled ? 'opacity-60' : ''}`}
      role="tablist"
      aria-label="Edit preview toggle"
    >
      <span
        className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl bg-blue-600 transition-transform ${value === 'preview' ? 'translate-x-full' : ''}`}
      />
      <button
        className={`relative z-10 rounded-xl px-3 py-1.5 text-xs font-semibold transition-transform active:scale-95 ${
          value === 'edit' ? 'text-white' : 'text-slate-600'
        }`}
        onClick={() => onChange('edit')}
        type="button"
        role="tab"
        aria-selected={value === 'edit'}
        disabled={disabled}
      >
        Edit
      </button>
      <button
        className={`relative z-10 rounded-xl px-3 py-1.5 text-xs font-semibold transition-transform active:scale-95 ${
          value === 'preview' ? 'text-white' : 'text-slate-600'
        }`}
        onClick={() => onChange('preview')}
        type="button"
        role="tab"
        aria-selected={value === 'preview'}
        disabled={disabled}
      >
        Preview
      </button>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function IconDone() {
  return <Check className="h-4 w-4" />;
}
