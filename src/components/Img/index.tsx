import { stringify } from 'query-string';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';

function parseSrc(src: string, params?: any) {
  return `${src.split('?')[0]}?${stringify(params)}`;
}

export function srcset(src: string, imgixParams = {}) {
  const resolutions: number[] = [],
    sets = [];

  let prev = 100;

  while (prev <= 8192) {
    resolutions.push(2 * Math.round(prev / 2));
    prev *= 1 + 0.08 * 2;
  }

  for (var i = 0; i < resolutions.length; i++) {
    const params = {
      w: resolutions[i],
      ...imgixParams
    };

    sets.push(`${parseSrc(src, params)} ${resolutions[i]}w`);
  }

  return sets.join(', ');
}

export type ImgProps = {
  responsive?: boolean;
  imgixParams?: any;
} & ComponentProps<'img'>;

/**
 * ### Responsive, lazily-loaded, blur-up style image component for Imgix images
 */
export function Img({
  src = '',
  alt,
  width,
  height,
  style,
  responsive = true,
  imgixParams = { auto: 'format' },
  ...props
}: ImgProps) {
  const [ready, setReady] = useState(false),
    placeholder = `${parseSrc(src, imgixParams)}&px=12&q=1&blur=400`;

  useEffect(() => {
    setReady(true);
  }, []);

  if (!/^https?:/.test(src) || !responsive) {
    return (
      <img
        style={{
          textIndent: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}
        src={src}
        alt={alt}
        {...props}
      />
    );
  }

  return (
    <img
      style={{
        ...style,
        textIndent: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      }}
      src={ready ? src : placeholder}
      srcSet={ready ? srcset(src, imgixParams) : ''}
      alt={alt}
      {...props}
    />
  );
}
