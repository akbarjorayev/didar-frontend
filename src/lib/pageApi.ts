import type { AnswerRequest, PageDTO, PageEntity, PageSummary, PageViewResponse } from '../types';

const DEFAULT_API_BASE = 'https://db02-90-156-198-169.ngrok-free.app/api/v1/page';
const API_BASE = DEFAULT_API_BASE;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function requestJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': '1',
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(errorText || `Request failed with status ${response.status}`, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function mapPageEntityToSummary(page: PageEntity): PageSummary {
  return {
    id: page.id,
    title: page.title,
    closed: page.closed,
    finalAnswer: page.finalAnswer,
    answeredAt: page.answeredAt,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
  };
}

export function getPageOwnerList(telegramId: string) {
  return requestJson<PageSummary[]>('', {
    headers: {
      'telegram-id': telegramId,
    },
  });
}

export function createPage(telegramId: string, body: PageDTO) {
  return requestJson<PageEntity>('', {
    method: 'POST',
    headers: {
      'telegram-id': telegramId,
    },
    body: JSON.stringify(body),
  });
}

export function updatePage(telegramId: string, pageId: string, body: Partial<PageDTO>) {
  return requestJson<PageEntity>(`/${pageId}`, {
    method: 'PATCH',
    headers: {
      'telegram-id': telegramId,
    },
    body: JSON.stringify(body),
  });
}

export function getPageView(pageId: string) {
  return requestJson<PageViewResponse>(`/${pageId}`);
}

export function submitPageAnswer(pageId: string, body: AnswerRequest) {
  return requestJson<PageViewResponse>(`/${pageId}/answer`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
