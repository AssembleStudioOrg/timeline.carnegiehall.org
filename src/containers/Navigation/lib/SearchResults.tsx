import { GlobalData } from '$src/lib/GlobalData';
import { useContext, useEffect, useState } from 'react';
import Fuse from 'fuse.js';

export function SearchResults({ search }: { search: string }) {
  const { stories, genres, performers } = useContext(GlobalData),
    [results, setResults] = useState<any[]>();

  useEffect(() => {
    const fuse = new Fuse(
      [
        ...stories.map((story: any) => ({ type: 'story', ...story })),
        ...genres.map((genre: any) => ({ type: 'genre', ...genre })),
        ...performers.map((performer: any) => ({
          type: 'performer',
          ...performer
        }))
      ],
      { keys: ['title', 'name'] }
    );

    setResults(fuse.search(search));
  }, [search]);

  function getHref(item: any) {
    switch (item.type) {
      case 'genre':
        return `/genres/${item.slug}`;
      case 'story':
        return `/stories/${item.slug}`;
      case 'performer':
        return `/performers/${item.slug}`;
      default:
        return `/${item.slug}`;
    }
  }

  return (
    <div>
      <div className="mb-6">
        {results?.length} results for &quot;{search}&quot;
      </div>
      {results?.map(({ item }, i) => (
        <a
          href={getHref(item)}
          className="block mb-8 transition-colors md:mb-11 hover:text-red"
          key={i}
        >
          <h1 className="text-lg font-bold font-ui md:text-2xl">
            {item.title || item.name}
          </h1>
          <span className="label text-xsm">{item.type}</span>
        </a>
      ))}
    </div>
  );
}
