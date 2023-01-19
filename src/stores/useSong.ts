import create from 'zustand';

export type SongConfig = {
  /** Source of the audio */
  source?: {
    type: 'local' | 'apple';
    appleId?: string;
  };
  /** Title of the track */
  title?: string;
  /** Artist of the track */
  artist?: string;
  /** URL of the cover image */
  cover?: string;
  /** Attribution of cover image */
  attribution?: string;
  /** Track or preview to play */
  audio?: string;
};

/**
 * Parse CMS song data into SongConfig format
 * @param song Song data from CMS
 */
export function parseSong(song: any): SongConfig {
  const type = song.apple_music_song_id ? 'apple' : 'local';
  return {
    source: {
      type,
      appleId: song.apple_music_song_id
    },
    audio: song.song_file || song.apple_music_attributes?.preview_song_url,
    title: song.title,
    artist: song.artist?.name || song.apple_music_attributes?.artist_name,
    attribution: song.artist?.attribution,
    cover:
      type === 'apple'
        ? song.apple_music_attributes?.artwork?.url
            .replace('{w}', 128)
            .replace('{h}', 128)
        : /^(data:image)/.test(song.artist?.image)
        ? null
        : song.artist?.image
  };
}

type UseSong = {
  song?: SongConfig;
  set(song: SongConfig): void;
};

export const useSong = create<UseSong>((set) => {
  return {
    song: {},
    set: (song) => set({ song })
  };
});
