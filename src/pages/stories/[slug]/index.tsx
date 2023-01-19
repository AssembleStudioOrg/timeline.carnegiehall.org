import { AdaptiveHeader, HeroImg } from '$src/components/HeroImg';
import { Meta } from '$src/components/Meta';
import { NavBar } from '$src/components/NavBar';
import { PageGrid } from '$src/components/PageGrid';
import { RelatedStories } from '$src/components/RelatedStories';
import { ScrollDown } from '$src/components/ScrollDown';
import { ScrollProgress } from '$src/components/ScrollProgress';
import { ShareBar } from '$src/components/ShareBar';
import { Article, ARTICLE_CONTAINER_STYLES } from '$src/containers/Article';
import { cms } from '$src/lib/cms';
import { useExplorations } from '$src/stores/useExplorations';
import { usePlayer } from '$src/stores/usePlayer';
import { parseSong, useSong } from '$src/stores/useSong';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

/**
 * Story page
 */
export default function StoryPage({ data, stories }: any) {
  const setSong = useSong(useCallback((s) => s.set, [])),
    songPlaying = usePlayer(useCallback((s) => s.playing, [])),
    addExploration = useExplorations((s) => s.add),
    router = useRouter();

  useEffect(() => {
    if (!!data.default_song && !songPlaying) {
      setSong(parseSong(data.default_song));
    }

    addExploration({
      title: data.title,
      href: router.asPath,
      type: 'Story'
    });
  }, [data, setSong, router, addExploration]);

  return (
    <>
      <ScrollProgress />
      <AdaptiveHeader />

      <Meta {...data.seo} />
      <div className="!col-span-full sticky top-0 ">
        <HeroImg
          image={data.hero_image}
          color={data.color}
          attribution={data.hero_image_attribution}
          withStoryHeading={{
            title: data.title,
            authors: data.authors,
            position: data.position
          }}
        />
        <ScrollDown className="z-10 text-grey-100 absolute left-[var(--page-gutter)] bottom-[22vh] md:bottom-11 " />
      </div>

      <div className="!col-span-full z-10 bg-grey-100">
        <PageGrid className={ARTICLE_CONTAINER_STYLES}>
          <Article content={data.content} authors={data.authors} />
        </PageGrid>

        <ShareBar className="relative z-10" citation={data.citation || ''} />
        <RelatedStories story={data} stories={stories} />
        <NavBar
          period={{ start: data.year_start, end: data.year_finish }}
          showOnScroll
        />
      </div>
    </>
  );
}

/** Page data */
export const getStaticProps: GetStaticProps = async ({ params, preview }) => {
  const [data, stories] = await Promise.all([
    cms(`v2/stories/${params?.slug}`, { preview }),
    cms(`v2/stories`, { preview })
  ]);

  return {
    props: {
      data,
      stories: stories.data
    }
  };
};

/** Static pages generation */
export const getStaticPaths: GetStaticPaths = async () => {
  const { data: stories } = await cms(`v2/stories`);

  return {
    paths: stories.map(({ slug, id }: any) => ({
      params: { slug, id }
    })),
    fallback: false
  };
};
