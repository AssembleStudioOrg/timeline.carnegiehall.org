import { Link } from '$src/components/Link';
import { PageGrid } from '$src/components/PageGrid';
import { useExplorations } from '$src/stores/useExplorations';

export function Explore() {
  const explorations = useExplorations((s) => s.explorations);

  return (
    <>
      <style jsx>{`
        .timeline::before,
        .timeline::after {
          content: '';
          position: absolute;
          left: -22px;
          transform: translate(-50%, 4px);
        }
        @media (min-width: 767px) {
          .timeline::before,
          .timeline::after {
            transform: translate(-50%, 7px);
          }
        }

        .timeline::before {
          top: 0;
          bottom: 0;
          border-left: 1px solid currentColor;
        }

        .timeline:last-child::before {
          bottom: unset;
          height: 6px;
        }

        .timeline:first-child::before {
          top: 6px;
        }

        .timeline::after {
          top: 6px;
          width: 7px;
          height: 7px;
          border: 1px solid currentColor;
          border-radius: 7px;
          background: black;
        }

        .timeline--empty::before {
          border-style: dashed;
        }

        .timeline:not(.timeline--empty):last-child::after {
          background: var(--color-grey-100);
        }

        .timeline--empty:first-child::after {
          background: var(--color-grey-100);
        }
      `}</style>

      <PageGrid className="overflow-visible scrollable translate-x-[-16px] sm:translate-x-[-28px] md:translate-x-0">
        <ul className="mt-4">
          {explorations.length ? (
            explorations
              .reverse()
              .map(({ href, title, type }: any, i: number) => (
                <li className={`relative pb-9 md:pb-11 timeline`} key={i}>
                  <Link
                    className="transition-colors hover:text-red"
                    href={href}
                  >
                    <h2 className="text-lg font-bold md:text-2xl font-ui">
                      {title}
                    </h2>
                    <span className="block mt-1 text-xs label">{type}</span>
                  </Link>
                </li>
              ))
          ) : (
            <>
              <li className={`relative pb-9 md:pb-11 timeline timeline--empty`}>
                <h2 className="text-lg font-bold md:text-2xl font-ui timline timeline-empty">
                  Select a story, genre, or performer to begin your journey
                  through the history of African American Music
                </h2>
              </li>
              <li
                className={`relative pb-9 md:pb-11 timeline timeline--empty`}
              ></li>
            </>
          )}
        </ul>
      </PageGrid>
    </>
  );
}
