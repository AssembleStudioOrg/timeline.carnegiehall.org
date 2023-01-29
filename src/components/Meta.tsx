import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { resolveUrl } from '../lib/utils';

export type MetaProps = {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Cover image (used for social networks) */
  image?: string;
  /** Optional keywords */
  keywords?: string;
};

/**
 * Sets a page's <head> meta data
 */
export function Meta({ title, description, image, keywords }: MetaProps) {
  const { pathname, locale, defaultLocale, query } = useRouter();
  let resolvedPathName = pathname;

  Object.keys(query).map(
    (key) =>
      (resolvedPathName = resolvedPathName.replace(
        `[${key}]`,
        (query as any)[key]
      ))
  );

  const resolvedCover =
      image &&
      (resolveUrl(image, process.env.NEXT_PUBLIC_SITE_URL || '') as string),
    resolvedLocation =
      locale === defaultLocale
        ? `${process.env.NEXT_PUBLIC_SITE_URL}${resolvedPathName}`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}${resolvedPathName}`;

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={resolvedLocation}
        openGraph={{
          url: resolvedLocation,
          title,
          description,
          images: resolvedCover ? [{ url: resolvedCover }] : []
        }}
      />
      {keywords && (
        <Head>
          <meta name="keywords" content={keywords} />
        </Head>
      )}
    </>
  );
}
