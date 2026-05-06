import { useState, useRef } from 'react';
import { Save } from 'lucide-react';
import { usePageForm } from '../hooks/usePageForm';
import type { PageFormValues } from '../types';
import { Field, PrimaryButton, ToggleSwitch } from './ui';

export function PageEditor({
  title,
  subtitle,
  initialValue,
  saveText,
  savingText,
  onSave,
}: {
  title: string;
  subtitle: string;
  initialValue: PageFormValues;
  saveText: string;
  savingText: string;
  onSave: (input: PageFormValues) => Promise<void>;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const questionRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    mode,
    setMode,
    title: pageTitle,
    setTitle,
    question,
    setQuestion,
    yesMessage,
    setYesMessage,
    noMessage,
    setNoMessage,
    responseToYes,
    setResponseToYes,
    responseToNo,
    setResponseToNo,
    previewQuestion,
    error,
    getValidatedInput,
    hasChanges,
  } = usePageForm(initialValue);

  async function handleSave() {
    if (isSaving) {
      return;
    }

    const input = getValidatedInput();

    if (!input) {
      questionRef.current?.focus();
      return;
    }

    setIsSaving(true);

    try {
      await onSave(input);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-3 xl:max-w-5xl">
      <div className="space-y-2">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
        <ToggleSwitch value={mode} onChange={setMode} disabled={isSaving} />
      </div>

      {mode === 'edit' ? (
        <fieldset disabled={isSaving} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm disabled:opacity-80 xl:grid-cols-2">
          <Field label="Title">
            <input
              className="h-10 w-full rounded-2xl border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-blue-400"
              value={pageTitle}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Coffee with me?"
              maxLength={255}
            />
          </Field>

          <Field label="Question">
            <textarea
              ref={questionRef}
              className="min-h-36 max-h-80 w-full resize-y rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 xl:min-h-48"
              placeholder="Do you want to grab coffee this weekend?"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={7}
              maxLength={2000}
            />
          </Field>

          <Field label="Yes message">
            <input
              className="h-10 w-full rounded-2xl border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-blue-400"
              value={yesMessage}
              onChange={(event) => setYesMessage(event.target.value)}
              placeholder="Yay, happy to hear yes!"
              maxLength={1000}
            />
          </Field>

          <Field label="No message">
            <input
              className="h-10 w-full rounded-2xl border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-blue-400"
              value={noMessage}
              onChange={(event) => setNoMessage(event.target.value)}
              placeholder="No worries, I still appreciate you."
              maxLength={1000}
            />
          </Field>

          <Field label="Response to YES">
            <input
              className="h-10 w-full rounded-2xl border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-blue-400"
              value={responseToYes}
              onChange={(event) => setResponseToYes(event.target.value)}
              placeholder="Thanks for saying yes."
              maxLength={1000}
            />
          </Field>

          <Field label="Response to NO">
            <input
              className="h-10 w-full rounded-2xl border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-blue-400"
              value={responseToNo}
              onChange={(event) => setResponseToNo(event.target.value)}
              placeholder="Thanks for being honest."
              maxLength={1000}
            />
          </Field>

          {error ? <div className="text-xs font-semibold text-rose-600 xl:col-span-2">{error}</div> : null}
        </fieldset>
      ) : (
        <div
          className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
        >
          <div className="space-y-3 text-left">
            <div className="rounded-none border-4 border-slate-900 p-4">
              <div className="text-base font-bold text-slate-900">{pageTitle.trim() || 'Untitled page'}</div>
              <p className="mt-2 whitespace-pre-wrap break-words text-center text-xl font-bold text-slate-900">
                {previewQuestion || 'Your question preview appears here.'}
              </p>
            </div>

            <div className="flex justify-center gap-1.5">
              <button type="button" className="h-11 w-28 shrink-0 rounded-none border-4 border-slate-900 bg-white px-3 text-sm font-semibold text-slate-900 transition-transform active:scale-95">
                {yesMessage.trim() || 'Yes'}
              </button>
              <button type="button" className="h-11 w-28 shrink-0 rounded-none border-4 border-slate-900 bg-white px-3 text-sm font-semibold text-rose-600 transition-transform active:scale-95">
                {noMessage.trim() || 'No'}
              </button>
            </div>

            <div className="grid gap-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs text-emerald-900">
                <span className="font-semibold">After YES</span>
                <div className="mt-1">{responseToYes.trim() || 'Thanks for saying yes.'}</div>
              </div>
              <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-2.5 text-xs text-rose-900">
                <span className="font-semibold">After NO</span>
                <div className="mt-1">{responseToNo.trim() || 'Thanks for being honest.'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <PrimaryButton className="flex-1" onClick={handleSave} disabled={isSaving || (saveText === 'Update' && !hasChanges)}>
          <Save className="h-4 w-4" />
          {isSaving ? savingText : saveText}
        </PrimaryButton>
      </div>
    </section>
  );
}
