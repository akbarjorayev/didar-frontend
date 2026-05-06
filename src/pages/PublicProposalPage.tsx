import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { submitPageAnswer } from '../lib/pageApi';
import { usePageView } from '../hooks/usePageView';
import type { AnswerValue } from '../types';

export function PublicProposalPage() {
  const { pageId } = useParams();
  const { page, isLoading, error, setPage } = usePageView(pageId);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [noClickCount, setNoClickCount] = useState(0);
  const [noButtonState, setNoButtonState] = useState<'initial' | 'locked' | 'animating'>('initial');
  const [noButtonAnchor, setNoButtonAnchor] = useState<{ x: number; y: number } | null>(null);
  const [noButtonDelta, setNoButtonDelta] = useState<{ dx: number; dy: number } | null>(null);
  const [showNoDialog, setShowNoDialog] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [responseDialogMessage, setResponseDialogMessage] = useState<string | null>(null);
  const [responseDialogCountdown, setResponseDialogCountdown] = useState(5);
  const [activeBackgroundImage, setActiveBackgroundImage] = useState('/imgs/default-background.webp');
  const noCommentTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const backgroundAssets = ['/imgs/default-background.webp', '/imgs/yes-background.webp', '/imgs/no-background.webp'];

    backgroundAssets.forEach((source) => {
      const image = new Image();
      image.src = source;
    });
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');

    const updatePointerMode = () => {
      setIsTouchDevice(mediaQuery.matches);
    };

    updatePointerMode();
    mediaQuery.addEventListener('change', updatePointerMode);

    return () => {
      mediaQuery.removeEventListener('change', updatePointerMode);
    };
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');

    const title = page?.title?.trim() || 'Didar Proposal';
    const description = page?.question?.trim() || 'Vote and respond on this Didar proposal page.';
    const pageUrl = typeof window === 'undefined' ? '' : window.location.href;

    document.title = title;
    if (metaDescription) metaDescription.setAttribute('content', description);
    if (ogTitle) ogTitle.setAttribute('content', title);
    if (ogDescription) ogDescription.setAttribute('content', description);
    if (ogUrl) ogUrl.setAttribute('content', pageUrl);

    return () => {
      document.title = previousTitle;
      if (metaDescription) metaDescription.setAttribute('content', 'Create and share interactive decision pages with Didar.');
      if (ogTitle) ogTitle.setAttribute('content', 'Didar');
      if (ogDescription) ogDescription.setAttribute('content', 'Create and share interactive decision pages with Didar.');
      if (ogUrl) ogUrl.setAttribute('content', pageUrl);
    };
  }, [page]);

  useEffect(() => {
    if (!showNoDialog) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeNoDialog();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNoDialog]);

  useEffect(() => {
    if (!responseDialogMessage) {
      return;
    }

    if (responseDialogCountdown === 1) {
      const closeTimeoutId = window.setTimeout(() => {
        setResponseDialogMessage(null);
        setResponseDialogCountdown(5);
      }, 1000);

      return () => {
        window.clearTimeout(closeTimeoutId);
      };
    }

    const timeoutId = window.setTimeout(() => {
      setResponseDialogCountdown((current) => current - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [responseDialogCountdown, responseDialogMessage]);

  useEffect(() => {
    if (!page?.finalAnswer) {
      setActiveBackgroundImage('/imgs/default-background.webp');
      return;
    }

    if (page.finalAnswer === 'YES') {
      setActiveBackgroundImage('/imgs/yes-background.webp');
      return;
    }

    if (page.finalAnswer === 'NO') {
      setActiveBackgroundImage('/imgs/no-background.webp');
      return;
    }

    setActiveBackgroundImage('/imgs/default-background.webp');
  }, [page?.finalAnswer]);

  useEffect(() => {
    if (!showNoDialog) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      noCommentTextareaRef.current?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [showNoDialog]);

  function moveNoButton() {
    if (noClickCount >= 1) {
      return false;
    }

    const buttonRect = noButtonRef.current?.getBoundingClientRect();
    if (!buttonRect) return false;

    const buttonWidth = 112;
    const buttonHeight = 44;
    const safeGap = 12;
    const minX = safeGap;
    const maxX = Math.max(safeGap, window.innerWidth - buttonWidth - safeGap);
    const minY = safeGap;
    const maxY = Math.max(safeGap, window.innerHeight - buttonHeight - safeGap);

    const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    // Calculate delta from current position to target
    const dx = randomX - buttonRect.left;
    const dy = randomY - buttonRect.top;

    // Step 1: Anchor button at current position, no transition yet
    setNoButtonState('locked');
    setNoButtonAnchor({ x: buttonRect.left, y: buttonRect.top });
    setNoButtonDelta({ dx: 0, dy: 0 });

    // Step 2: Animate to target using transform delta
    requestAnimationFrame(() => {
      setNoButtonState('animating');
      setNoButtonDelta({ dx, dy });
    });

    setNoClickCount((current) => Math.min(current + 1, 1));
    return true;
  }

  function closeNoDialog() {
    setShowNoDialog(false);
    setComment('');
    setSubmitError(null);
    setNoButtonState('initial');
    setNoButtonAnchor(null);
    setNoButtonDelta(null);
  }

  async function handleNoButtonClick() {
    if (isSubmitting || !page?.canSubmit) {
      return;
    }

    if (moveNoButton()) {
      return;
    }

    setShowNoDialog(true);
  }

  function handleNoButtonHover() {
    if (isTouchDevice || showNoDialog || isSubmitting || !page?.canSubmit) {
      return;
    }

    moveNoButton();
  }

  function handleNoButtonTap() {
    if (!isTouchDevice) {
      return;
    }

    handleNoButtonClick();
  }

  async function handleNoSubmit() {
    if (comment.trim().length < 10) {
      setSubmitError('Comment must be at least 10 characters.');
      return;
    }

    await handleAnswer('NO');
  }

  async function handleAnswer(answer: AnswerValue) {
    if (!pageId || !page?.canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const updatedPage = await submitPageAnswer(pageId, {
        answer,
        comment: comment.trim(),
      });
      setPage(updatedPage);
      setActiveBackgroundImage(answer === 'YES' ? '/imgs/yes-background.webp' : '/imgs/no-background.webp');
      const responseMessage =
        answer === 'YES'
          ? (updatedPage.responseToYes?.trim() || 'Thanks for saying yes.')
          : (updatedPage.responseToNo?.trim() || 'Thanks for being honest.');
      setResponseDialogCountdown(5);
      setResponseDialogMessage(responseMessage);
      if (answer === 'NO') {
        closeNoDialog();
      } else {
        setShowNoDialog(false);
        setNoButtonState('initial');
        setNoButtonAnchor(null);
        setNoButtonDelta(null);
      }
    } catch (requestError) {
      setSubmitError(requestError instanceof Error ? requestError.message : 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-6">
        <div className="grid h-16 w-16 place-items-center rounded-full border-[3px] border-slate-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">{error || 'Page not found'}</div>
      </div>
    );
  }

  return (
    <section
      className="flex min-h-screen w-full items-center justify-center px-4 py-6"
      style={{
        backgroundImage: `url(${activeBackgroundImage})`,
        backgroundRepeat: 'repeat',
        backgroundPosition: 'top left',
        backgroundSize: 'contain',
      }}
    >
      <div className="w-full max-w-xl space-y-4 text-left">
        <div className="rounded-none border-4 border-slate-900 bg-white p-4">
          <div className="text-base text-center font-bold text-slate-900">{page.title || 'Untitled page'}</div>
          <p className="mt-2 whitespace-pre-wrap break-words text-center text-xl font-bold text-slate-900">
            {page.question || 'No question available.'}
          </p>
        </div>

        {page.canSubmit ? (
          <div className="space-y-3">
            <div className="flex justify-evenly gap-1.5">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleAnswer('YES')}
                className="h-11 w-28 shrink-0 rounded-none border-4 border-slate-900 bg-white px-3 text-sm font-semibold text-slate-900 transition-all duration-300 active:scale-95 disabled:opacity-60"
              >
                {page.yesMessage || 'Yes'}
              </button>
              <button
                ref={noButtonRef}
                type="button"
                disabled={isSubmitting}
                onMouseEnter={handleNoButtonHover}
                onClick={isTouchDevice ? handleNoButtonTap : () => setShowNoDialog(true)}
                style={
                  noButtonState !== 'initial' && noButtonAnchor && noButtonDelta
                    ? {
                        position: 'fixed',
                        top: `${noButtonAnchor.y}px`,
                        left: `${noButtonAnchor.x}px`,
                        zIndex: 50,
                        width: '112px',
                        height: '44px',
                        padding: 0,
                        transform: `translate(${noButtonDelta.dx}px, ${noButtonDelta.dy}px)`,
                        transition: noButtonState === 'animating' ? 'transform 300ms ease-out' : 'none',
                      }
                    : undefined
                }
                className={`h-11 w-28 rounded-none border-4 border-slate-900 bg-white px-3 text-sm font-semibold text-rose-600 active:scale-95 disabled:opacity-60 ${
                  noButtonState !== 'initial' ? 'grid place-items-center' : ''
                }`}
              >
                {page.noMessage || 'No'}
              </button>
            </div>

          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-evenly gap-1.5">
              <button
                type="button"
                disabled={page.finalAnswer === 'NO'}
                className={`h-11 w-28 shrink-0 rounded-none border-4 border-slate-900 px-3 text-sm font-semibold disabled:opacity-60 ${
                  page.finalAnswer === 'YES' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-900'
                }`}
              >
                {page.yesMessage || 'Yes'}
              </button>
              <button
                type="button"
                disabled={page.finalAnswer === 'YES'}
                className={`h-11 w-28 shrink-0 rounded-none border-4 border-slate-900 px-3 text-sm font-semibold disabled:opacity-60 ${
                  page.finalAnswer === 'NO' ? 'bg-rose-600 text-white' : 'bg-white text-rose-600'
                }`}
              >
                {page.noMessage || 'No'}
              </button>
            </div>
          </div>
        )}

        {submitError ? <div className="text-xs font-semibold text-rose-600">{submitError}</div> : null}

        {responseDialogMessage ? (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 w-full max-w-md border-4 border-slate-900 bg-white p-4 text-left shadow-xl">
              <div className="text-sm font-semibold text-slate-900">{responseDialogMessage}</div>
              <div className="mt-2 text-xs font-semibold text-slate-600">Closing in {responseDialogCountdown}</div>
            </div>
          </div>
        ) : null}
      </div>

      {showNoDialog ? (
        <div className="fixed inset-0 z-50 m-0 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Close modal backdrop"
            className="absolute inset-0 bg-black/40"
            onClick={closeNoDialog}
          />
          <div className="relative z-10 w-full max-w-md border-4 border-slate-900 bg-white p-4 text-left shadow-xl">
            <div className="text-sm font-semibold text-slate-900">Tell us why you selected <span className="text-rose-600">No</span></div>
            <div className="relative mt-2">
              <textarea
                ref={noCommentTextareaRef}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className="w-full min-h-28 max-h-72 resize-y border-4 border-slate-900 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
                placeholder="Write your comment"
                minLength={10}
                maxLength={4000}
                required
              />
              {comment.length < 10 && (
                <div className="absolute right-3 top-2 text-xs font-semibold text-rose-600">
                  {comment.trim().length}/10
                </div>
              )}
            </div>
            <button
              type="button"
              disabled={isSubmitting || comment.trim().length < 10}
              onClick={handleNoSubmit}
              className="mt-3 h-11 w-full rounded-none border-4 border-slate-900 bg-white px-3 text-sm font-semibold text-slate-900 transition-transform active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
