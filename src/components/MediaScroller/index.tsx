import { plaintext } from '$src/lib/utils';
import type { HTMLProps } from 'react';
import { useEffect, useState } from 'react';
import { useScrollPercentage } from 'react-scroll-percentage/dist/';
import { Img } from '../Img';
import { MediaDetails } from '../MediaDetails';
import { PageGrid } from '../PageGrid';
import { Video } from '../Video';

const FRICTION = 3;

type MediaItemProps = {
  type: 'image' | 'video';
  media: string;
  caption: string;
  credit: string;
  creditLink?: string;
  url?: string;
  disabled?: boolean;
};

const MediaItem = ({
  type,
  media,
  url,
  creditLink,
  disabled,
  alt,
  onVisible,
  ...props
}: { onVisible(): void } & Partial<MediaItemProps> &
  HTMLProps<HTMLDivElement>) => {
  const [ref, percentage] = useScrollPercentage(),
    [ready, setReady] = useState(false),
    [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => window.dispatchEvent(new CustomEvent('scroll')), 0);
    setReady(true);
  }, []);

  useEffect(() => {
    if (percentage > 0 && !visible) {
      onVisible();
      setVisible(true);
    }

    if (percentage === 0 && visible) {
      onVisible();
      setVisible(false);
    }
  }, [visible, percentage, onVisible]);

  return (
    <>
      <div className={`sticky top-24 ${!ready ? 'invisible' : ''}`} {...props}>
        <div
          className="flex flex-col items-center justify-center"
          style={{ height: `calc(100vh - 12rem)` }}
        >
          <div
            className="w-full"
            style={
              disabled
                ? {}
                : { transform: `scale(${1 - percentage / FRICTION})` }
            }
          >
            {type === 'image' ? (
              <Img
                src={media!}
                alt={alt || ''}
                className="mx-auto max-w-[100%] max-h-[80vh]"
                sizes="80vw"
              />
            ) : (
              <Video
                className="max-w-[80%] mx-auto"
                thumbnail={media || ''}
                src={url || ''}
              />
            )}
          </div>
        </div>
      </div>
      <div className="invisible" ref={ref}></div>
    </>
  );
};

export type MediaScrollerProps = {
  /** Media for the collection */
  media: MediaItemProps[];
} & HTMLProps<HTMLDivElement>;

/**
 * ### Full page scrolling collection of images and videos
 * MUST OPEN IN FULL VIEW TO DEMO
 */
export function MediaScroller({ media, className = '' }: MediaScrollerProps) {
  const [active, setActive] = useState(0);

  return (
    <PageGrid className={`bg-black py-7 ${className}`}>
      <MediaDetails
        className="sticky z-50 max-w-xs text-grey-100 top-6"
        caption={media[active]?.caption}
        credit={media[active]?.credit}
        creditLink={media[active]?.creditLink}
      />
      {media.map((item, i) => (
        <MediaItem
          onVisible={() => setActive(i)}
          alt={plaintext(item.caption)}
          {...item}
          style={{ zIndex: i }}
          disabled={media.length === 1}
          key={i}
        />
      ))}
    </PageGrid>
  );
}
