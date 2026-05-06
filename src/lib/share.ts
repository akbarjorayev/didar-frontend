export function buildShareUrl(proposalId: string) {
  const origin = typeof window === 'undefined' ? '' : window.location.origin;
  return `${origin}/p/${proposalId}`;
}

export async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const tempElement = document.createElement('textarea');
  tempElement.value = text;
  document.body.appendChild(tempElement);
  tempElement.select();
  document.execCommand('copy');
  document.body.removeChild(tempElement);
}

export async function shareProposalNative(shareUrl: string) {
  const shareData = {
    url: shareUrl,
  };

  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }

  await copyText(shareUrl);
}

export function openTelegramShare(shareUrl: string) {
  window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
}

export function openXShare(shareUrl: string) {
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
}

export function openWhatsAppShare(shareUrl: string) {
  window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
}

export function openLinkedInShare(shareUrl: string) {
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
}

export async function openInstagramShare(shareUrl: string) {
  window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  await copyText(shareUrl);
}
