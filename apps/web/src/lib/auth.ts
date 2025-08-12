export async function devLoginOnce() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('devAuthed') === 'true') return;
  const devUser = process.env.NEXT_PUBLIC_DEV_USER || 'dev@local';
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/dev-login`, {
      method: 'POST',
      headers: { 'X-Dev-User': devUser },
      cache: 'no-store',
    });
    if (res.ok) {
      localStorage.setItem('devAuthed', 'true');
    }
  } catch {}
}


