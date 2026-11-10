export const ACCESS_TOKEN_KEY = 'impersonation-access-token';

/** The email link wins over a token left in this tab. */
export function readAccessToken(queryValue: string | null, storedValue: string | null): string {
  const fromQuery = (queryValue ?? '').trim();
  if (fromQuery) return fromQuery;
  return (storedValue ?? '').trim();
}
