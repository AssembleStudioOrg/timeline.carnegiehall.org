import type { KeyboardEvent } from 'react';
class HTTPError extends Error {}

/**
 * Fetch with HTTP errors and retries
 */
export async function httpfetch(
  url: string,
  opts?: any,
  retries = 3
): Promise<any> {
  const res = await fetch(url, opts);

  if (res.ok) {
    return res;
  }

  if (retries > 0) {
    return httpfetch(url, opts, retries - 1);
  }

  const error = new HTTPError(`Fetch error: ${res.statusText}`);
  error.code = res.status;
  throw error;
}

/**
 * Call a funciton on enter/space
 */
export const onKeyAction = (cb: () => void) => (e: KeyboardEvent<any>) => {
  if (e.key === 'Enter' || e.key === ' ') {
    cb();
  }
};

/**
 * Naive utility to strip HTML tags from a string
 * @param html HTML string
 */
export function plaintext(html: string) {
  return html?.replace(/<[^>]*>?/gm, '');
}

/**
 * Resole relative URLs against a source
 * @param link URL to resolve
 * @param source Source URL to resolve against
 */
export function resolveUrl(link: string, source: string) {
  return !/^https?:\/\//i.test(link) ? new URL(link, source).href : link;
}

/**
 * Helper to update CSS variables
 * @param properties Object of CSS properties
 */
export function setProperties(properties: any) {
  Object.keys(properties).forEach((property: string) =>
    document.documentElement.style.setProperty(property, properties[property])
  );
}
