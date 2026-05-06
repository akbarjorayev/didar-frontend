import { useMemo } from 'react';
import { Check, Clipboard, Share2 } from 'lucide-react';
import { FaInstagram, FaLinkedinIn, FaTelegram, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';
import { useSearchParams } from 'react-router-dom';
import { PrimaryButton } from '../components/ui';
import { useCopyFeedback } from '../hooks/useCopyFeedback';
import {
  buildShareUrl,
  copyText,
  openInstagramShare,
  openLinkedInShare,
  openTelegramShare,
  openWhatsAppShare,
  openXShare,
  shareProposalNative,
} from '../lib/share';
import type { PageSummary } from '../types';

export function SharePage({
  pages,
  isLoading,
  error,
}: {
  pages: PageSummary[];
  isLoading: boolean;
  error: string | null;
}) {
  const [searchParams] = useSearchParams();
  const { copied, triggerCopied } = useCopyFeedback(1000);
  const pageId = searchParams.get('id') ?? pages[0]?.id ?? '';
  const page = pages.find((entry) => entry.id === pageId);

  const shareUrl = useMemo(() => {
    if (!page) {
      return '';
    }

    return buildShareUrl(page.id);
  }, [page]);

  async function handleNativeShare() {
    if (!shareUrl) {
      return;
    }

    await shareProposalNative(shareUrl);
  }

  async function handleCopy() {
    if (!shareUrl) {
      return;
    }

    await copyText(shareUrl);
    triggerCopied();
  }

  function handleTelegramShare() {
    if (!shareUrl) {
      return;
    }

    openTelegramShare(shareUrl);
  }

  function handleXShare() {
    if (!shareUrl) {
      return;
    }

    openXShare(shareUrl);
  }

  function handleWhatsAppShare() {
    if (!shareUrl) {
      return;
    }

    openWhatsAppShare(shareUrl);
  }

  async function handleInstagramShare() {
    if (!shareUrl) {
      return;
    }

    await openInstagramShare(shareUrl);
  }

  function handleLinkedInShare() {
    if (!shareUrl) {
      return;
    }

    openLinkedInShare(shareUrl);
  }

  return (
    <section className="w-full max-w-full space-y-3 overflow-hidden">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Share</div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">Loading share data...</div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">{error}</div>
      ) : page ? (
        <div className="grid w-full max-w-full min-w-0 gap-3">
          <div className="grid w-full max-w-full min-w-0 gap-2 overflow-hidden rounded-2xl border border-slate-200 bg-white px-3.5 pt-3.5 pb-6 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">URL</div>
            <div className="relative w-full max-w-full min-w-0 overflow-hidden pb-2">
              <div
                className="w-full break-all rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-14 text-xs text-slate-700"
                title={shareUrl}
              >
                {shareUrl}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy share URL"
                className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-transform active:scale-95"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Clipboard className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              className="grid h-14 w-14 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition-transform active:scale-95"
              type="button"
              onClick={handleTelegramShare}
              aria-label="Share on Telegram"
            >
              <FaTelegram className="h-5 w-5" />
            </button>
            <button
              className="grid h-14 w-14 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition-transform active:scale-95"
              type="button"
              onClick={handleInstagramShare}
              aria-label="Share on Instagram"
            >
              <FaInstagram className="h-5 w-5" />
            </button>
            <button
              className="grid h-14 w-14 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition-transform active:scale-95"
              type="button"
              onClick={handleXShare}
              aria-label="Share on X"
            >
              <FaXTwitter className="h-5 w-5" />
            </button>
            <button
              className="grid h-14 w-14 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition-transform active:scale-95"
              type="button"
              onClick={handleLinkedInShare}
              aria-label="Share on LinkedIn"
            >
              <FaLinkedinIn className="h-5 w-5" />
            </button>
            <button
              className="grid h-14 w-14 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition-transform active:scale-95"
              type="button"
              onClick={handleWhatsAppShare}
              aria-label="Share on WhatsApp"
            >
              <FaWhatsapp className="h-5 w-5" />
            </button>
          </div>

          <PrimaryButton className="w-full rounded-full" onClick={handleNativeShare}>
            <Share2 className="h-4 w-4" />
            Share
          </PrimaryButton>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">No shared page found</h2>
          <p className="mt-1 text-sm text-slate-600">Create a page first so there is something to share.</p>
        </div>
      )}
    </section>
  );
}
