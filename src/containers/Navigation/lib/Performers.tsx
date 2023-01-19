import { Link } from '$src/components/Link';
import { GlobalData } from '$src/lib/GlobalData';
import { useContext } from 'react';

export function Performers() {
  const { performers } = useContext(GlobalData),
    sortedPerformers = Object.values(
      performers.reduce((acc: any, performer: any) => {
        const letter = performer.name[0].toLocaleUpperCase();

        if (!acc[letter]) {
          acc[letter] = { letter, performers: [performer] };
        } else {
          acc[letter].performers.push(performer);
        }
        return acc;
      }, {})
    ).sort((a: any, b: any) => {
      if (a.letter < b.letter) {
        return -1;
      } else if (a.letter > b.letter) {
        return 1;
      } else {
        return 0;
      }
    });

  return (
    <div>
      {sortedPerformers.map(({ letter, performers }: any) => (
        <section className="mt-9 first:mt-0" key={letter}>
          <h1 className="text-lg font-bold text-white md:text-2xl opacity-20 font-ui">
            {letter}
          </h1>
          <ul className="mt-3 md:mt-4 md:columns-3">
            {performers.map(({ id, slug, name, show_in_menu }: any) =>
              show_in_menu ? (
                <li className="mt-4 text-gray-100 md:mr-4 md:mt-0" key={id}>
                  <Link
                    className="transition-colors hover:text-red"
                    href={`/performers/${slug}`}
                  >
                    {name}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      ))}
    </div>
  );
}
