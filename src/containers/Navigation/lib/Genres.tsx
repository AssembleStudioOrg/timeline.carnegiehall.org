import { Link } from '$src/components/Link';
import { GlobalData } from '$src/lib/GlobalData';
import { useContext } from 'react';

export function Genres() {
  const { genres } = useContext(GlobalData),
    sortedGenres = Object.values(
      genres.reduce((acc: any, genre: any) => {
        const letter = genre.name[0].toLocaleUpperCase();

        if (!acc[letter]) {
          acc[letter] = { letter, genres: [genre] };
        } else {
          acc[letter].genres.push(genre);
        }
        return acc;
      }, {})
    );

  return (
    <div>
      {sortedGenres.map(({ letter, genres }: any) => (
        <section className="mt-9 first:mt-0" key={letter}>
          <h1 className="text-lg font-bold text-white md:text-2xl opacity-20 font-ui">
            {letter}
          </h1>
          <ul className="mt-3 md:mt-4 md:columns-3">
            {genres.map(({ id, slug, name }: any) => (
              <li className="mt-4 text-gray-100 md:mr-4 md:mt-0" key={id}>
                <Link
                  className="transition-colors hover:text-red"
                  href={`/genres/${slug}`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
