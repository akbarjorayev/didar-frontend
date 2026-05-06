import type { TelegramUser } from '../types';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id?: number;
            first_name?: string;
            username?: string;
            photo_url?: string;
          };
        };
        ready?: () => void;
        expand?: () => void;
      };
    };
  }
}

export function getTelegramUser(): TelegramUser | null {
  const telegramWebApp = window.Telegram?.WebApp;
  const user = telegramWebApp?.initDataUnsafe?.user;

  if (!telegramWebApp || !user?.id || !user.first_name) {
    return null;
  }

  return {
    id: user.id,
    firstName: user.first_name,
    username: user.username,
    photoUrl: user.photo_url,
  };
}

export function isTelegramAvailable(): boolean {
  return Boolean(window.Telegram?.WebApp?.initDataUnsafe?.user?.id);
}
