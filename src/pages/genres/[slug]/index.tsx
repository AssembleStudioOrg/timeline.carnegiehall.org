import { AuthorCredit } from '$src/components/AuthorCredit';
import { Button } from '$src/components/Button';
import { Img } from '$src/components/Img';
import { InfluenceList } from '$src/components/InfluenceList';
import { Link } from '$src/components/Link';
import { MediaDetails } from '$src/components/MediaDetails';
import { Meta } from '$src/components/Meta';
import { OverflowScroll } from '$src/components/OverflowScroll';
import { PageGrid } from '$src/components/PageGrid';
import { ScrollProgress } from '$src/components/ScrollProgress';
import { SectionDivider } from '$src/components/SectionDivider';
import { SectionTitle } from '$src/components/SectionTitle';
import { ShareBar } from '$src/components/ShareBar';
import { Song } from '$src/components/Song';
import { SwipeCarousel } from '$src/components/SwipeCarousel';
import { Article, ARTICLE_SECTION_LAYOUT } from '$src/containers/Article';
import { cms } from '$src/lib/cms';
import { BREAKPOINTS } from '$src/lib/consts';
import { useBreakpoint } from '$src/lib/hooks';
import { useExplorations } from '$src/stores/useExplorations';
import { usePageLayout } from '$src/stores/useLayout';
import { usePlayer } from '$src/stores/usePlayer';
import { parseSong, useSong } from '$src/stores/useSong';
import { useTimeline } from '$src/stores/useTimeline';
import type { Author } from '$types/data';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

function FeatureList({
  title,
  items,
  type
}: {
  title: string;
  items: { id: number; title: string }[];
  type: string;
}) {
  const router = useRouter(),
    isDesktop = useBreakpoint('(min-width: 540px)'),
    setFilters = useTimeline(useCallback((s) => s.setFilters, []));

  function viewFeature(title: any) {
    setFilters({
      [type]: new Set([title])
    });
    router.push('/timeline');
  }

  return (
    <div className="text-center md:h-full md:text-left md:flex-1 md:flex md:flex-col md:items-center md:border-r last:border-r-0 md:py-6">
      <div>
        <h2 className="font-bold font-ui">{title}</h2>
        <ul className="pt-4 text-sm md:text-xsm label pb-7">
          {items.map(({ title, id }) => (
            <li className="my-2" key={id}>
              <span
                onClick={() => isDesktop && viewFeature(title)}
                className="transition-colors cursor-pointer pointer-events-none hover:text-red sm:pointer-events-auto"
              >
                {title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Genre page
 */
export default function GenrePage({ data }: any) {
  const setSong = useSong(useCallback((s) => s.set, [])),
    songPlaying = usePlayer(useCallback((s) => s.playing, [])),
    isDesktop = useBreakpoint(`(min-width: ${BREAKPOINTS.md})`),
    router = useRouter(),
    addExploration = useExplorations((s) => s.add),
    bibliography = data.content.find(
      ({ type }: any) => type === 'bibliography-collection'
    ),
    featureLists = [
      <FeatureList
        title="Themes"
        items={data.themes}
        type="themes"
        key="themes"
      />,
      <FeatureList
        title="Musical Features"
        type="features"
        items={data.musical_features}
        key="features"
      />,
      <FeatureList
        type="instruments"
        title="Instruments"
        items={data.instruments}
        key="instruments"
      />
    ];

  useEffect(() => {
    if (data.default_song && !songPlaying) {
      setSong(parseSong(data.default_song));
    }
    addExploration({
      title: data.name,
      href: router.asPath,
      type: 'Genre'
    });
  }, [setSong, data, addExploration, router]);

  usePageLayout(
    {
      header: {
        withNavBar: {
          title: data.display_date,
          cta: {
            label: 'Explore Stories',
            href: '/stories'
          },
          highlight: data.tradition.color
        }
      }
    },
    [data.display_date, data.tradition.color]
  );

  return (
    <>
      <style jsx global>{`
        .features {
          position: relative;
        }

        .features::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${data.tradition.color};
          opacity: 0.5;
          z-index: 1;
        }

        .features > * {
          position: relative;
          z-index: 5;
        }
      `}</style>

      <Meta {...data.seo} />

      <ScrollProgress />

      <PageGrid className="py-8">
        <div className="flex">
          <InfluenceList
            className="hidden w-1/3 md:block"
            direct={data.influenced_by}
            indirect={data.cross_influenced_by}
            direction="backwards"
          />
          <section className="flex flex-col items-center flex-1 px-6 text-center md:pt-28">
            <span className="text-sm leading-5 label">
              {data.tradition.title}
            </span>
            <h1 className="pt-3 pb-6 text-2xl font-bold font-display md:text-4xl lg:text-6xl md:pb-9">
              {data.name}
            </h1>
          </section>
          <InfluenceList
            className="hidden w-1/3 md:block"
            direct={data.influenced}
            indirect={data.cross_influenced}
            direction="forwards"
          />
        </div>
        <SectionDivider dividers={{ top: 'short', bottom: 'standard' }}>
          <Button href="/timeline">Back to timeline</Button>
        </SectionDivider>

        <aside className="md:hidden grid grid-cols-[minmax(0,1fr),auto,minmax(0,1fr)] !col-span-full w-full">
          <InfluenceList
            theme="bars"
            direct={data.influenced_by}
            indirect={data.cross_influenced_by}
            direction="backwards"
          />
          <div className="w-px h-full bg-black" />
          <InfluenceList
            theme="bars"
            direct={data.influenced}
            indirect={data.cross_influenced}
            direction="forwards"
          />
        </aside>

        {data.hero_image && (
          <section>
            <SectionDivider dividers={{ top: 'none', bottom: 'standard' }}>
              <SectionDivider
                className="relative w-full"
                dividers={{
                  top: 'none',
                  bottom: 'standard'
                }}
              >
                <MediaDetails
                  className="text-center md:text-left md:h-0 md:overflow-visible md:absolute md:left-0 md:top-0"
                  caption={data.hero_image?.caption}
                  credit={data.hero_image?.credit}
                  creditLink={data.hero_image?.credit_link}
                />
              </SectionDivider>
              <Img
                className="rounded-2xl"
                src={data.hero_image.src}
                alt={data.hero_image.alt}
                sizes="96vw"
              />
            </SectionDivider>
          </section>
        )}

        {!!data.songs?.length && (
          <OverflowScroll
            withNav={isDesktop}
            className="py-4 bg-black"
            containerClasses="mr-12"
          >
            {data.songs.map(
              (song: any) =>
                !!song && (
                  <Song
                    className="text-white"
                    highlight={data.tradition.color}
                    song={parseSong(song)}
                    theme="standard"
                    key={song.id}
                  />
                )
            )}
          </OverflowScroll>
        )}

        <PageGrid as="section" className="pt-12 features pb-7 md:py-16">
          <div className="mb-10 text-center">
            <h1 className="text-lg font-bold font-display">
              Key Attributes of {data.name}
            </h1>
            {isDesktop && <span>Select to filter timeline</span>}
          </div>
          {isDesktop ? (
            <div className="flex items-center">{featureLists}</div>
          ) : (
            <SwipeCarousel>{featureLists}</SwipeCarousel>
          )}
        </PageGrid>

        <Article leadIn={false} content={data.content} authors={data.authors} />

        <SectionDivider className="subgrid ">
          <div className="w-full text-white bg-black">
            <OverflowScroll fullwidth withNav navOffset={-90}>
              {data.notable_performers.map(
                ({ image, name, slug, attribution }: any, i: number) => (
                  <Link
                    href={`/performers/${slug}`}
                    className="w-[315px]"
                    key={i}
                  >
                    <div className="overflow-hidden group">
                      <Img
                        src={image}
                        title={attribution}
                        className="w-full transition-transform group-hover:scale-110"
                        style={{ transformOrigin: 'center' }}
                        width={315}
                        height={315}
                        alt={name}
                        imgixParams={{ fit: 'crop', ar: '1:1' }}
                        sizes="315px"
                      />
                    </div>
                    <div className="text-sm leading-5 text-center label py-9">
                      {name}
                    </div>
                  </Link>
                )
              )}
            </OverflowScroll>
          </div>
        </SectionDivider>
        <div className="max-w-4xl mx-auto">
          {data.authors.map((author: Author, i: number) => (
            <AuthorCredit author={author} key={i} />
          ))}
        </div>

        <SectionDivider dividers={{ top: 'standard', bottom: 'none' }}>
          <SectionTitle title="Bibliography" />
          <div className="text-sm richtext">
            <ol className={`${ARTICLE_SECTION_LAYOUT} pl-1 mt-14`}>
              {bibliography &&
                bibliography.children.map(({ content }: any, i: number) => (
                  <li key={i}>{content.bibliography}</li>
                ))}
            </ol>
          </div>
        </SectionDivider>
      </PageGrid>
      <ShareBar citation={data.citation || ''} />
    </>
  );
}

/** Page data */
export const getStaticProps: GetStaticProps = async ({ params, preview }) => {
  const data = await cms(`v2/genres/${params?.slug}`, { preview });

  if (!data) {
    return {
      notFound: true
    };
  }

  return {
    props: { data }
  };
};

/** Static pages generation */
export const getStaticPaths: GetStaticPaths = async () => {
  const { data: genres } = await cms(`v2/genres`);

  return {
    paths: genres.map(({ slug }: any) => ({ params: { slug } })),
    fallback: false
  };
};
