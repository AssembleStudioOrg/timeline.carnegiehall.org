import { ReactComponent as CaretIcon } from '$src/assets/icons/caret-left.svg';
import { AdaptiveHeader, HeroImg } from '$src/components/HeroImg';
import { srcset } from '$src/components/Img';
import { Meta } from '$src/components/Meta';
import { NavBar } from '$src/components/NavBar';
import { PageGrid } from '$src/components/PageGrid';
import { RelatedStories } from '$src/components/RelatedStories';
import { ScrollDown } from '$src/components/ScrollDown';
import { ScrollHide } from '$src/components/ScrollHide';
import { ScrollProgress } from '$src/components/ScrollProgress';
import { ShareBar } from '$src/components/ShareBar';
import { SwipeCarousel, SwipeIndicator } from '$src/components/SwipeCarousel';
import { Article, ARTICLE_CONTAINER_STYLES } from '$src/containers/Article';
import { cms } from '$src/lib/cms';
import { BREAKPOINTS } from '$src/lib/consts';
import { useBreakpoint } from '$src/lib/hooks';
import { onKeyAction } from '$src/lib/utils';
import { usePlayer } from '$src/stores/usePlayer';
import { parseSong, useSong } from '$src/stores/useSong';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';
import _TransitionReplace from 'react-css-transition-replace';

const TransitionReplace = _TransitionReplace as any;

/**
 * Home page
 */
export default function HomePage({ stories, allStories }: any) {
  const router = useRouter(),
    setSong = useSong(useCallback((s) => s.set, [])),
    playing = usePlayer(useCallback((s) => s.playing, [])),
    [active, setActive] = useState(stories[0].slug),
    [story, setStory] = useState(stories[0]),
    [initialised, setInitialised] = useState(false),
    getStoryIndex = (s?: string) =>
      stories.findIndex(({ slug }: any) => slug === s),
    isDesktop = useBreakpoint(`(min-width: ${BREAKPOINTS.xl})`),
    article = useRef(null);

  const updateStory = useCallback(
    (slug: string) => {
      const story = stories.find((s: any) => s.slug === slug);
      setActive(slug);
      router.replace(
        {
          pathname: router.pathname,
          query: {
            story: slug
          }
        },
        undefined,
        { shallow: true }
      );
      setStory(story);

      if (!playing && !!story.default_song) {
        setSong(parseSong(story.default_song));
      }
    },
    [router, playing, setStory, stories, setSong]
  );

  useEffect(() => {
    if (router.isReady && !initialised) {
      router.query.story && updateStory(router.query.story as string);
      setInitialised(true);
    }
  }, [router.isReady, initialised, router.query, updateStory]);

  return (
    <>
      <style jsx global>{`
        /** Fade out then up */
        .fadeup-leave {
          opacity: 1;
        }
        .fadeup-leave.fadeup-leave-active {
          opacity: 0;
          transition: opacity 300ms ease;
        }

        .fadeup-enter {
          opacity: 0;
          transform: translateY(20px);
        }
        .fadeup-enter.fadeup-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: all 700ms ease 200ms;
        }

        /** Crossfade */
        .crossfade-leave {
          opacity: 1;
        }
        .crossfade-leave.crossfade-leave-active {
          opacity: 0;
          transition: opacity 900ms ease;
        }

        .crossfade-enter {
          opacity: 0;
        }
        .crossfade-enter.crossfade-enter-active {
          opacity: 1;
          transition: opacity 900ms ease;
        }
      `}</style>

      <Meta {...story?.seo} />

      <Head>
        {stories.map(({ id, hero_image }: any) => (
          <link
            rel="preload"
            href={hero_image.src}
            as="image"
            imageSrcSet={srcset(hero_image.src, { auto: 'format' })}
            key={id}
          />
        ))}
      </Head>

      <ScrollProgress />
      <AdaptiveHeader />

      <div className="sticky top-0 !col-span-full">
        {isDesktop ? (
          <>
            <TransitionReplace
              transitionName="crossfade"
              transitionEnterTimeout={1000}
              transitionLeaveTimeout={1000}
            >
              <div key={story.id}>
                <HeroImg
                  image={story.hero_image}
                  color={story.color}
                  attribution={story.hero_image_attribution}
                  withStoryHeading={{
                    title: story.title,
                    authors: story.authors,
                    position: story.position
                  }}
                />
              </div>
            </TransitionReplace>
            <ScrollDown className="absolute left-[var(--page-gutter)] text-grey-100 bottom-10" />
            <div className="absolute right-[var(--page-gutter)] top-0 pt-3 max-w-[280px] flex h-full flex-col justify-end z-10">
              <ScrollHide
                threshold={200}
                className="text-xs text-grey-100 label h-1/2"
                style={{ minHeight: '400px' }}
              >
                <span className="font-bold">More Stories</span>
                <ul>
                  {stories.map(({ title, slug }: any) => (
                    <li
                      className={`group my-6 hover:text-red cursor-pointer relative leading-[18px] ${
                        active === slug && 'text-red'
                      }`}
                      onClick={() => updateStory(slug)}
                      onKeyDown={onKeyAction(() => updateStory(slug))}
                      tabIndex={0}
                      aria-label={`Open ${title}`}
                      key={slug}
                    >
                      <CaretIcon
                        className={`fill-current w-2 h-2 absolute top-1/2 -left-4
                      ${active === slug ? 'block' : 'hidden'}
                    `}
                        style={{
                          transform: 'translate(0, -50%) rotate(180deg)'
                        }}
                      />
                      {title}
                    </li>
                  ))}
                </ul>
              </ScrollHide>
            </div>
          </>
        ) : (
          <PageGrid className="relative swipe">
            <SwipeCarousel
              withIndicator={false}
              onSlideChange={(i: number) => updateStory(stories[i].slug)}
              index={getStoryIndex(active)}
            >
              {stories.map((story: any) => (
                <HeroImg
                  image={story.hero_image}
                  color={story.color}
                  withStoryHeading={{
                    title: story.title,
                    authors: story.authors,
                    position: story.position
                  }}
                  key={story.id}
                />
              ))}
            </SwipeCarousel>
            <ScrollHide className="text-white absolute bottom-[22vh] md:bottom-10 w-full z-50 flex items-end justify-between">
              <ScrollDown />
              <SwipeIndicator
                length={stories.length}
                activeSlide={getStoryIndex(active)}
              />
            </ScrollHide>
          </PageGrid>
        )}
      </div>
      <PageGrid className="relative z-10 bg-grey-100">
        <Article
          ref={article}
          content={story.content}
          authors={story.authors}
          className={ARTICLE_CONTAINER_STYLES}
        />
        <ShareBar citation={story.citation} />
        <RelatedStories story={story} stories={allStories} />
      </PageGrid>
      <NavBar
        cta={{ label: 'Explore Timeline', href: '/timeline' }}
        period={{ start: story.year_start, end: story.year_finish }}
        showOnScroll
      />
    </>
  );
}

/** Page data */
export const getStaticProps: GetStaticProps = async ({ preview }) => {
  const [settings, stories] = await Promise.all([
    cms(`site-settings`),
    cms(`v2/stories`, { preview })
  ]);

  return {
    props: {
      stories: settings.featured_stories.data,
      allStories: stories.data
    }
  };
};
