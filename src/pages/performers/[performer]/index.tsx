import { Button } from '$src/components/Button';
import { Callout } from '$src/components/Callout';
import { Heading } from '$src/components/Heading';
import { Img } from '$src/components/Img';
import { MediaScroller } from '$src/components/MediaScroller';
import { Meta } from '$src/components/Meta';
import { NavBar } from '$src/components/NavBar';
import { OverflowScroll } from '$src/components/OverflowScroll';
import { PageGrid } from '$src/components/PageGrid';
import { ScrollProgress } from '$src/components/ScrollProgress';
import { SectionDivider } from '$src/components/SectionDivider';
import { SectionTitle } from '$src/components/SectionTitle';
import { ShareBar } from '$src/components/ShareBar';
import { Song } from '$src/components/Song';
import {
  ARTICLE_SECTION_LAYOUT,
  ARTICLE_TEXT_STYLES
} from '$src/containers/Article';
import { cms } from '$src/lib/cms';
import { BREAKPOINTS } from '$src/lib/consts';
import { GlobalData } from '$src/lib/GlobalData';
import { useBreakpoint } from '$src/lib/hooks';
import { wikidata as wiki } from '$src/lib/wikidata';
import { useExplorations } from '$src/stores/useExplorations';
import { parseSong } from '$src/stores/useSong';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

/**
 * Performer page
 */
export default function PerformerPage({ data, missing }: any) {
  const { settings } = useContext(GlobalData),
    isDesktop = useBreakpoint(`(min-width: ${BREAKPOINTS.md})`),
    addExploration = useExplorations((s) => s.add),
    [wikidata, setWikidata] = useState<any>(),
    router = useRouter();

  useEffect(() => {
    addExploration({
      title: data.name,
      href: router.asPath,
      type: 'Performer'
    });
  });

  useEffect(() => {
    if (!missing) {
      wiki(data.ch_agent_id)
        .then((data) => setWikidata(data))
        .catch((e) => console.error(e));
    }
  }, [data, missing]);

  return (
    <>
      <Meta
        title={data.seo.title || data.name}
        description={data.seo.description}
        image={data.seo.image || data.image}
        keywords={data.seo.keywords}
      />

      {!missing && <ScrollProgress />}

      {!missing && (
        <NavBar
          cta={{ label: 'Explore Stories', href: '/stories' }}
          direction="down"
          period={{
            start: '1600',
            end: 'Present'
          }}
        />
      )}

      <PageGrid
        className={`pt-10 text-white bg-black-300 md:pt-24 ${
          missing ? 'min-h-screen' : ''
        }`}
      >
        <div className="mx-auto text-center">
          <span className="label">Performer</span>
          <Heading className="mt-3" heading={data.name} />
        </div>
        <SectionDivider
          dividers={{
            top: 'extra-short',
            bottom: missing ? 'extra-short' : 'standard'
          }}
          className="mt-5 md:mt-9"
        >
          <Button
            className="bg-transparent min-w-[170px] hover:bg-grey-50 hover:text-black-300"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </SectionDivider>
        {!missing &&
          data.image &&
          data.image !==
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' && (
            <SectionDivider dividers={{ top: 'none', bottom: 'long' }}>
              <Img className="w-full max-w-lg aspect-1 " src={data.image} />
            </SectionDivider>
          )}

        {missing && (
          <div className={ARTICLE_SECTION_LAYOUT}>
            <div
              className={ARTICLE_TEXT_STYLES}
              dangerouslySetInnerHTML={{ __html: settings.missing_content }}
            />
            <a
              className="text-lg italic border-b border-red-500 font-body md:text-xl"
              href={settings.missing_link.href}
            >
              {settings.missing_link.label}
            </a>
          </div>
        )}
      </PageGrid>

      {missing && (
        <NavBar
          cta={{ label: 'Explore Timeline', href: '/timeline' }}
          direction="down"
          period={{
            start: '1600',
            end: '2020'
          }}
        />
      )}

      {!missing && (
        <>
          {!!data.songs?.length && (
            <PageGrid className="bg-black">
              <OverflowScroll
                withNav={isDesktop}
                className="py-4 bg-black"
                containerClasses="mr-12"
              >
                {data.songs.map(
                  (song: any) =>
                    !!song && (
                      <Song
                        className="text-white hover:text-red"
                        song={{ ...parseSong(song), artist: data.name }}
                        theme="standard"
                        cover={false}
                        key={song.id}
                      />
                    )
                )}
              </OverflowScroll>
            </PageGrid>
          )}

          <div className={ARTICLE_SECTION_LAYOUT}>
            {wikidata?.wikipedia && (
              <>
                <SectionDivider>
                  <SectionTitle title="Biography" />
                </SectionDivider>
                <div className={ARTICLE_TEXT_STYLES}>
                  <p>{wikidata?.wikipedia?.summary}</p>
                  <a
                    className="italic border-b border-red"
                    href={wikidata?.wikipedia?.url}
                    target="blank_"
                    rel="noopener noreferrer"
                  >
                    Continue reading on Wikipedia
                  </a>
                </div>
              </>
            )}

            <SectionDivider>
              <SectionTitle title={`${data.name} at Carnegie Hall`} />
            </SectionDivider>
            <Callout
              label="View Performances at Carnegie Hall"
              href={`https://www.carnegiehall.org/About/History/Performance-History-Search?q=&dex=prod_PHS&pf=${encodeURIComponent(
                data.name
              )}`}
            />
            <SectionDivider
              dividers={{ top: 'none', bottom: 'standard' }}
            ></SectionDivider>
          </div>
          {wikidata?.image && (
            <MediaScroller
              media={
                [
                  {
                    media: wikidata.image,
                    type: 'image',
                    caption: data.name,
                    credit: '',
                    srcset: false
                  }
                ] as any
              }
            />
          )}

          {(wikidata?.website ||
            wikidata?.appleMusic ||
            wikidata?.musicBrainz) && (
            <SectionDivider>
              <SectionTitle title="Explore Further" />
            </SectionDivider>
          )}
          <div className={ARTICLE_SECTION_LAYOUT}>
            {!!wikidata?.website && (
              <Callout list label="Official Website" href={wikidata?.website} />
            )}
            {!!wikidata?.appleMusic && (
              <Callout
                list
                label="Listen on Apple Music"
                href={wikidata?.appleMusic}
              />
            )}
            {!!wikidata?.musicBrainz && (
              <Callout
                list
                label="View on MusicBrainz"
                href={wikidata?.musicBrainz}
              />
            )}
          </div>

          <ShareBar
            className="mt-13 md:mt-28"
            citation={`"${data.name}". ${new Date().getFullYear()}`}
          />
        </>
      )}
    </>
  );
}

/** Page data */
export const getStaticProps: GetStaticProps = async ({ params, preview }) => {
  try {
    const data = await cms(`v2/notable-performers/${params?.performer}`, {
      preview
    });

    return {
      props: {
        data,
        missing: !data?.ch_agent_id
      }
    };
  } catch {
    return {
      notFound: true
    };
  }
};

/** Static pages generation */
export const getStaticPaths: GetStaticPaths = async () => {
  const performers = await cms(`v2/notable-performers`),
    slugs = performers.map(({ slug }: any) => slug);

  return {
    paths: slugs.map((slug: string) => ({
      params: { performer: slug }
    })),
    fallback: false
  };
};
