import { useRef, useState } from 'react';

export function useCopyFeedback(durationMs = 1000) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  function triggerCopied() {
    setCopied(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      timeoutRef.current = null;
    }, durationMs);
  }

  return { copied, triggerCopied };
}
