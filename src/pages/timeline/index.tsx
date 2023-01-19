import { DataTable } from '$src/components/DataTable';
import { Meta } from '$src/components/Meta';
import { Timeline } from '$src/components/Timeline';
import { cms } from '$src/lib/cms';
import { BREAKPOINTS } from '$src/lib/consts';
import { GlobalData } from '$src/lib/GlobalData';
import { useBreakpoint } from '$src/lib/hooks';
import { TIMELINE_TABLE } from '$src/lib/schemas';
import { onKeyAction } from '$src/lib/utils';
import { usePageLayout } from '$src/stores/useLayout';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useContext, useEffect, useState } from 'react';

type View = 'timeline' | 'list';

/**
 * Timeline page
 */
export default function TimelinePage({ data }: any) {
  const router = useRouter(),
    { settings } = useContext(GlobalData),
    [view, setView] = useState<View>('timeline'),
    isDesktop = useBreakpoint(`(min-width: ${BREAKPOINTS.lg})`, true);

  usePageLayout(
    {
      header: {
        withNavBar: {
          direction: 'down',
          cta: {
            label: 'Explore Stories',
            href: '/stories'
          },
          period: { start: '1600', end: 'Present' }
        }
      }
    },
    []
  );

  useEffect(() => {
    if (router?.query?.view) {
      setView(router.query.view as View);
    }
  }, [router.query]);

  function changeView(view: View) {
    setView(view);
    router.push(
      {
        pathname: router.pathname,
        query: { view }
      },
      undefined,
      { shallow: true }
    );
  }

  return (
    <>
      <Meta
        title={settings.seo_timeline_title}
        description={settings.seo_timeline_description}
        image={settings.seo_timeline_image}
      />
      <div className="relative bg-white subgrid">
        {view === 'timeline' ? (
          <div className="pb-20 col-span-full">
            <span
              className="block text-md absolute lg:fixed transition-colors hover:text-red right-[var(--page-gutter)] top-7 lg:top-auto lg:bottom-10 underline cursor-pointer z-10"
              onClick={() => changeView('list')}
              onKeyDown={onKeyAction(() => changeView('list'))}
              tabIndex={0}
            >
              List View
            </span>
            <Timeline data={data} />
          </div>
        ) : (
          <div className="subgrid scrollable">
            <DataTable
              className="!col-span-full"
              columns={
                isDesktop
                  ? TIMELINE_TABLE.columns.desktop
                  : TIMELINE_TABLE.columns.mobile
              }
              data={data.map(TIMELINE_TABLE.genreMapper)}
            />
            <button
              className="shadow-card hover:bg-black hover:text-white transition-colors cursor-pointer fixed left-[var(--page-gutter)] rounded bottom-9 py-3 px-7 bg-white font-ui font-bold text-sm"
              onClick={() => changeView('timeline')}
              onKeyDown={onKeyAction(() => changeView('timeline'))}
              tabIndex={0}
            >
              Back to Timeline
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/** Page data */
export const getStaticProps: GetStaticProps = async ({ preview }) => {
  const { data } = await cms(`v2/timeline`, { preview });

  return {
    props: { data }
  };
};
