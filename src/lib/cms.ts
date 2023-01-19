import { CMS_API } from './consts';
import { httpfetch } from './utils';

/**
 * CMS API Wrapper
 */
export async function cms(path: string, opts?: { preview?: boolean }) {
  return httpfetch(
    `${CMS_API}/${path}${opts?.preview ? '?draft=true' : ''}`
  ).then((r) => r.json());
}

/**
 * Resolve Menu link
 */
export function resolveMenuLink(link: {
  url: string | null;
  destination: 'internal' | 'external';
  page: { slug: string };
}) {
  return link.destination === 'external' ? link.url : `/${link.page.slug}`;
}
