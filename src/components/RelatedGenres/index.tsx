import type { HTMLProps } from 'react';
import { ReactComponent as ArrowIcon } from '$src/assets/icons/arrow.svg';
import { useTimeline } from '$src/stores/useTimeline';
import { useRouter } from 'next/router';
import { ARTICLE_SECTION_LAYOUT } from '$src/containers/Article';

type Attribute = {
  id: number;
  title: string;
};
export type RelatedGenresProps = {
  /** Musical features */
  features: Attribute[];
  /** Instruments */
  instruments: Attribute[];
  /** Musical themes */
  themes: Attribute[];
} & HTMLProps<HTMLDivElement>;

/**
 * ### Callout to filter timeline by a list of attributes
 */
export function RelatedGenres({
  features = [],
  instruments = [],
  themes = [],
  className
}: RelatedGenresProps) {
  const setFilters = useTimeline((s) => s.setFilters),
    router = useRouter();

  function go() {
    setFilters({
      musical_features: new Set(features.map(({ title }) => title)),
      instruments: new Set(instruments.map(({ title }) => title)),
      themes: new Set(themes.map(({ title }) => title))
    });
    router.push('/timeline');
  }
  return (
    <div
      onClick={go}
      className={`${ARTICLE_SECTION_LAYOUT} flex transition-colors justify-between border py-6 px-7 cursor-pointer hover:bg-black-300 hover:text-grey-50 ${
        className || ''
      }`}
    >
      <div>
        <h2 className="text-lg font-bold font-display">
          Explore Related Genres
        </h2>
        <span className="block mt-4 text-xsm label">
          Specific attributes:{' '}
          {[...features, ...instruments, ...themes]
            .map(({ title }) => title)
            .join(', ')}
        </span>
      </div>
      <ArrowIcon className="w-5 h-5 stroke-current" />
    </div>
  );
}
