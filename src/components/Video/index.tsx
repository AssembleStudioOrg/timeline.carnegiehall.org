import { ReactComponent as PlayIcon } from '$src/assets/icons/play.svg';
import type { HTMLProps } from 'react';
import ReactPlayer from 'react-player/lazy';

export type VideoProps = {
  /** Video URL */
  src: string;
  /** Thumbnail image to show before loading full video */
  thumbnail: string;
} & HTMLProps<HTMLDivElement>;

/**
 * ### Video player for Vimeo videos
 */
export function Video({ src, thumbnail, className = '' }: VideoProps) {
  return (
    <div
      className={`${className}`}
      style={{
        aspectRatio: '16/9',
        height: '100%',
        backgroundImage: `url(${thumbnail})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      }}
    >
      <ReactPlayer
        url={src}
        light={thumbnail}
        playing={!!thumbnail}
        controls
        width="100%"
        height="100%"
        playIcon={
          <div className="flex items-center justify-center w-20 h-20 text-white border-2 rounded-full">
            <PlayIcon className="fill-current h-9 w-9" />
          </div>
        }
        config={{
          vimeo: {
            playerOptions: {
              byline: false,
              title: false
            }
          },
          file: {
            attributes: {
              controls: true,
              poster: thumbnail
            }
          }
        }}
      />
    </div>
  );
}
