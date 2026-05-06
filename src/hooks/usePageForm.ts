import { useMemo, useState } from 'react';
import type { PageFormValues } from '../types';

export function usePageForm(initialValue: PageFormValues) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [title, setTitle] = useState(initialValue.title);
  const [question, setQuestion] = useState(initialValue.question);
  const [yesMessage, setYesMessage] = useState(initialValue.yesMessage);
  const [noMessage, setNoMessage] = useState(initialValue.noMessage);
  const [responseToYes, setResponseToYes] = useState(initialValue.responseToYes);
  const [responseToNo, setResponseToNo] = useState(initialValue.responseToNo);
  const [error, setError] = useState('');

  const previewQuestion = useMemo(() => question.trim(), [question]);

  const hasChanges = useMemo(() => {
    return (
      title !== initialValue.title ||
      question !== initialValue.question ||
      yesMessage !== initialValue.yesMessage ||
      noMessage !== initialValue.noMessage ||
      responseToYes !== initialValue.responseToYes ||
      responseToNo !== initialValue.responseToNo
    );
  }, [title, question, yesMessage, noMessage, responseToYes, responseToNo, initialValue]);

  function getValidatedInput(): PageFormValues | null {
    const normalized = {
      title: title.trim(),
      question: question.trim(),
      yesMessage: yesMessage.trim(),
      noMessage: noMessage.trim(),
      responseToYes: responseToYes.trim(),
      responseToNo: responseToNo.trim(),
    };

    if (Object.values(normalized).some((value) => !value)) {
      setError('Add all page fields before saving.');
      return null;
    }

    setError('');
    return normalized;
  }

  return {
    mode,
    setMode,
    title,
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
  };
}
