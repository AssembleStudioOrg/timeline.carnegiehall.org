import { Link } from '$src/components/Link';
import { NumberLabel } from '$src/components/NumberLabel';
import { GlobalData } from '$src/lib/GlobalData';
import { useContext } from 'react';

export function Stories() {
  const { stories } = useContext(GlobalData);

  return (
    <ul className="translate-x-[-28px] sm:translate-x-[-40px] md:translate-x-0">
      {stories.map(({ position, slug, title, authors }: any) => (
        <li className="mb-8 md:mb-11" key={position}>
          <Link
            className="flex transition-colors hover:text-red"
            href={`/stories/${slug}`}
          >
            <NumberLabel
              className="shrink-0 mt-[5px] md:mt-[3px] mr-3"
              outlined
              number={position}
            />
            <div>
              <h2 className="text-lg font-bold md:text-2xl font-ui">{title}</h2>
              <span className="text-xs label">
                By{' '}
                {authors
                  .map(
                    ({ first_name, last_name }: any) =>
                      `${first_name} ${last_name}`
                  )
                  .join(', ')}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
