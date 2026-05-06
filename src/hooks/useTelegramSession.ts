import { useEffect, useState } from 'react';
import { getTelegramUser } from '../lib/telegram';
import type { AppStatus, TelegramUser } from '../types';

export function useTelegramSession() {
  const [status, setStatus] = useState<AppStatus>('checking');
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    const telegramUser = getTelegramUser();

    if (!telegramUser) {
      setStatus('blocked');
      return;
    }

    window.Telegram?.WebApp?.ready?.();
    window.Telegram?.WebApp?.expand?.();
    setUser(telegramUser);
    setStatus('ready');
  }, []);

  return { status, user };
}
