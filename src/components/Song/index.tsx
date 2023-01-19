import { ReactComponent as PauseIcon } from '$src/assets/icons/pause-solid.svg';
import { ReactComponent as PlayIcon } from '$src/assets/icons/play-solid.svg';
import { usePlayer } from '$src/stores/usePlayer';
import { SongConfig, useSong } from '$src/stores/useSong';
import { HTMLProps, useCallback } from 'react';
import shallow from 'zustand/shallow';
import { Img } from '../Img';

export type SongProps = {
  /** Visual theme of the song */
  theme: 'standard' | 'inline';
  /** Song data */
  song: SongConfig;
  /** Optional label override */
  label?: string | any;
  /** Optional highlight color on hover */
  highlight?: string;
  /** Whether to show  the cover */
  cover?: boolean;
} & HTMLProps<HTMLDivElement>;

/**
 * ### A song with action to play audio on global player
 */
export function Song({
  theme = 'standard',
  song,
  label,
  highlight,
  cover = true,
  className = ''
}: SongProps) {
  const [currentSong, setSong] = useSong(
      useCallback((s) => [s.song, s.set], []),
      shallow
    ),
    [playing, setPlayer] = usePlayer(
      useCallback((s) => [s.playing, s.set], []),
      shallow
    ),
    songPlaying = playing && song.title === currentSong?.title,
    Icon = songPlaying ? PauseIcon : PlayIcon,
    parsedLabel =
      typeof label === 'object'
        ? `<${label.type}>${label.props.children}<${label.type}>`
        : label;

  async function play() {
    (setPlayer as any)({ playing: false });
    setTimeout(() => (setSong as any)(song), 1);
    setTimeout(() => (setPlayer as any)({ playing: true }), 1);
  }

  switch (theme) {
    case 'standard':
      return (
        <>
          <style jsx>{`
            .song:hover {
              color: ${highlight};
            }
          `}</style>
          <div
            className={`song cursor-pointer transition-colors group flex ${className}`}
            onClick={play}
          >
            {cover && (
              <div className={`relative h-[48px] w-[48px] mr-4`}>
                <div
                  className={`absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity z-10`}
                  style={{ background: highlight }}
                />
                <Img
                  src={song.cover || ''}
                  responsive={!!song?.cover}
                  alt={song?.artist || 'Album cover'}
                  title={song?.attribution || ''}
                  sizes="48px"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  style={{ filter: 'grayscale(1)' }}
                />
              </div>
            )}
            <div>
              <span
                className="block font-bold font-display"
                dangerouslySetInnerHTML={{
                  __html: parsedLabel || song?.title || ''
                }}
              />
              <div className="text-sm text-white font-ui">{song?.artist}</div>
            </div>
          </div>
        </>
      );
    case 'inline':
      return (
        <span
          className={`inline overflow-visible cursor-pointer text-red ${className}`}
          onClick={() => {
            if (songPlaying) {
              (setPlayer as any)({ playing: false });
            } else {
              play();
            }
          }}
        >
          <Icon
            className="inline p-px w-[1em] h-[1em] mr-[0.2em] fill-[red]"
            style={{ transform: 'translateY(-15%)' }}
          />
          <span
            dangerouslySetInnerHTML={{
              __html: parsedLabel || song?.title || ''
            }}
          />
        </span>
      );
  }
}
