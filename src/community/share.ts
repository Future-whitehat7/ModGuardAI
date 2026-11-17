export const COMMUNITY_LINK = 'https://modguardai.org/community';

export function cardText(headline: string, detail: string) {
  return `${headline}. ${detail}. ${COMMUNITY_LINK}`;
}

export function paintCard(lines: string[]) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.fillStyle = '#FAFAFA';
  ctx.fillRect(0, 0, 800, 1000);
  ctx.strokeStyle = '#C5A059';
  ctx.lineWidth = 10;
  ctx.strokeRect(28, 28, 744, 944);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1E3A8A';
  ctx.font = '28px Inter, sans-serif';
  ctx.fillText('MODGUARD', 400, 200);
  lines.forEach((line, index) => {
    ctx.fillStyle = index === 0 ? '#0F172A' : '#334155';
    ctx.font = index === 0 ? '60px Georgia, serif' : '28px Inter, sans-serif';
    ctx.fillText(line, 400, 380 + index * 72);
  });
  ctx.fillStyle = '#1E3A8A';
  ctx.font = '24px Inter, sans-serif';
  ctx.fillText('modguardai.org/community', 400, 860);
  return canvas;
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = filename;
  link.click();
}

export async function shareOrCopy(text: string, canvas: HTMLCanvasElement, filename: string) {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((value) => resolve(value), 'image/png'));
  const file = blob ? new File([blob], filename, { type: 'image/png' }) : undefined;
  if (typeof navigator.share === 'function') {
    const data: ShareData = { title: 'ModGuard', text, url: COMMUNITY_LINK };
    if (file && navigator.canShare?.({ files: [file] })) data.files = [file];
    try {
      await navigator.share(data);
      return 'shared' as const;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return 'closed' as const;
    }
  }
  await navigator.clipboard.writeText(text);
  return 'copied' as const;
}
