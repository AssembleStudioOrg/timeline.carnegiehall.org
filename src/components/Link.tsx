import { useEffect, useState } from 'react';
import NextLink, { LinkProps } from 'next/link';
import { resolveUrl } from '$src/lib/utils';
import { SITE_URL } from '$src/lib/consts';

/**
 * Link wrapper
 */
export function Link({ href = '', children, ...props }: LinkProps & any) {
  const [external, setExternal] = useState(false);

  useEffect(() => {
    setExternal(
      new URL(resolveUrl(href, SITE_URL!)).origin !== location.origin
    );
  }, [href]);

  return (
    <NextLink
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </NextLink>
  );
}
