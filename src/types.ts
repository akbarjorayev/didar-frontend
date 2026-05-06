export type TelegramUser = {
  id: number;
  firstName: string;
  username?: string;
  photoUrl?: string;
};

export type AnswerValue = 'YES' | 'NO';

export type PageDTO = {
  title: string;
  question: string;
  yesMessage: string;
  noMessage: string;
  responseToYes: string;
  responseToNo: string;
};

export type PageSummary = {
  id: string;
  title: string;
  closed: boolean;
  finalAnswer: AnswerValue | null;
  answeredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PageEntity = {
  id: string;
  title: string;
  telegramId: string;
  question: string;
  yesMessage: string;
  noMessage: string;
  responseToYes: string;
  responseToNo: string;
  finalAnswer: AnswerValue | null;
  finalComment: string | null;
  ipAddress: string | null;
  answeredAt: string | null;
  createdAt: string;
  updatedAt: string;
  closed: boolean;
};

export type PageViewResponse = {
  id: string;
  title: string | null;
  question: string | null;
  yesMessage: string | null;
  noMessage: string | null;
  responseToYes: string | null;
  responseToNo: string | null;
  canSubmit: boolean;
  finalAnswer: AnswerValue | null;
  finalComment: string | null;
  answeredAt: string | null;
};

export type AnswerRequest = {
  answer: AnswerValue;
  comment: string;
};

export type PageFormValues = PageDTO;

export type PageListState = {
  pages: PageSummary[];
  isLoading: boolean;
  error: string | null;
};

export type AppStatus = 'checking' | 'ready' | 'blocked';
