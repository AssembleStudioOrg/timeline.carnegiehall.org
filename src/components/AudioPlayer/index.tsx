import { ReactComponent as PauseIcon } from '$src/assets/icons/pause.svg';
import { ReactComponent as PlayIcon } from '$src/assets/icons/play.svg';
import { usePlayer } from '$src/stores/usePlayer';
import { useSong } from '$src/stores/useSong';
import { HTMLProps, useCallback, useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { useMeasure } from 'react-use';
import shallow from 'zustand/shallow';
import { Img } from '../Img';

export type AudioPlayerProps = {
  /** How the player should be displayed */
  displayMode?: 'full' | 'controls' | 'info';
} & HTMLProps<HTMLDivElement>;

const STATUS_MESSAGES = {
  local: {
    message: 'Provided by Carnegie Hall',
    interactive: false
  },
  preauth: {
    message: 'Listen on Apple Music',
    interactive: true
  },
  authed: {
    message: '+ Add to Apple Music Library',
    interactive: true
  },
  added: {
    message: 'Added to Apple Music Library',
    interactive: false
  },
  error: {
    message: 'Apple Music Connection Error',
    interactive: false
  },
  loading: {
    message: 'Apple music loading...',
    interactive: false
  },
  busy: {
    message: 'Connecting...',
    interactive: false
  }
};

/**
 * ### Audio player for playing song tracks
 */
export function AudioPlayer({
  displayMode = 'full',
  className = ''
}: AudioPlayerProps) {
  const song = useSong(useCallback((s) => s.song, [])),
    [playing, busy, loading, status, setPlayer, musickit, musickitLoading] =
      usePlayer(
        useCallback(
          (s) => [
            s.playing,
            s.busy,
            s.loading,
            s.status,
            s.set,
            s.musickit,
            s.musickitLoading
          ],
          []
        ),
        shallow
      ),
    [textOverflow, setTextOverflow] = useState(false),
    local = song?.source?.type === 'local',
    [title, { width: titleWidth }] = useMeasure(),
    [container, { width: containerWidth }] = useMeasure(),
    includesDisplay = (mode: string) =>
      displayMode === mode || displayMode === 'full',
    iconStyles = `w-5 h-5 md:w-6 md:h-6 fill-current`;

  /**
   * Fetch appropriate status message for player UI
   */
  function getStatus() {
    if (local) {
      return STATUS_MESSAGES.local;
    }

    if (musickitLoading) {
      return STATUS_MESSAGES.loading;
    }

    if (loading) {
      return STATUS_MESSAGES.busy;
    }

    return STATUS_MESSAGES[status as keyof typeof STATUS_MESSAGES];
  }

  /**
   * Trigger musickit action based on auth state
   */
  async function updateMusickit() {
    if (local) {
      return;
    }

    if (status === 'preauth') {
      try {
        setPlayer({ playing: false });
        await musickit?.authorize();
      } catch {
        setPlayer({ status: 'error' });
        setTimeout(() => setPlayer({ status: 'preauth' }), 3000);
      }
    }

    if (status === 'authed') {
      await musickit?.api.addToLibrary({ songs: [song?.source?.appleId] });
      setPlayer({ status: 'added' });
    }
  }

  /**
   * @effect
   * Check if title is overflowing
   */
  useEffect(() => {
    setTextOverflow(titleWidth > containerWidth);
  }, [titleWidth, containerWidth]);

  return (
    <>
      {/* <style jsx>{`
        .marquee {
          display: flex;
          position: relative;
          overflow: hidden;
          width: 100%;
        }
        .marquee::before,
        .marquee::after {
          background: linear-gradient(
            to right,
            var(--color-grey-100),
            transparent
          );
          content: '';
          height: 100%;
          position: absolute;
          width: 50px;
          z-index: 2;
        }

        .marquee::after {
          right: 0;
          top: 0;
          transform: rotateZ(180deg);
        }

        .marquee::before {
          left: 0;
          top: 0;
        }

        .marquee-inner {
          white-space: nowrap;
          margin-right: 1rem;
          animation: scroll ${titleWidth / 10}s linear infinite;
        }

        @keyframes scroll {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style> */}

      <div className={`flex items-center justify-end  ${className}`}>
        {includesDisplay('controls') && (
          <div
            className={`transition-colors cursor-pointer hover:text-red transition-opaciity ${
              busy && 'pointer-events-none opacity-50'
            }`}
            onClick={() => setPlayer({ playing: !playing })}
          >
            {playing ? (
              <PauseIcon className={iconStyles} />
            ) : (
              <PlayIcon className={iconStyles} />
            )}
          </div>
        )}
        {includesDisplay('info') && (
          <div
            ref={container as any}
            className={`relative mx-4 flex-1 font-ui lg:max-w-[210px] w-full font-bold text-sm ${
              displayMode === 'full' ? '' : 'text-center'
            }`}
          >
            <Marquee
              gradientColor={[242, 240, 234]}
              gradientWidth={textOverflow ? 50 : 0}
              loop={textOverflow ? 0 : 1}
            >
              <span
                ref={title as any}
                className="block mr-4 line-clamp-1"
              >{`${song?.title} by ${song?.artist} `}</span>
            </Marquee>
            <span
              className={`block line-clamp-1 text-grey-700  transition-colors ${
                getStatus().interactive && 'cursor-pointer hover:text-red'
              } ${status === 'added' && 'text-black'}
            `}
              onClick={updateMusickit}
            >
              {getStatus().message}
            </span>
          </div>
        )}
        {displayMode === 'full' && (
          <div className="flex-shrink-0 w-12 h-12">
            <Img
              src={song?.cover}
              responsive={!!song?.cover}
              alt={song?.artist || 'Album cover'}
              title={song?.attribution || ''}
              sizes="48px"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>
    </>
  );
}
