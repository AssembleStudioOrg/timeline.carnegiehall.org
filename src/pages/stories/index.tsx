import { CardStack } from '$src/components/CardStack';
import { HeroImg } from '$src/components/HeroImg';
import { Meta } from '$src/components/Meta';
import { NavBar } from '$src/components/NavBar';
import { NumberLabel } from '$src/components/NumberLabel';
import { PageGrid } from '$src/components/PageGrid';
import { cms } from '$src/lib/cms';
import { GlobalData } from '$src/lib/GlobalData';
import { usePageLayout } from '$src/stores/useLayout';
import type { Author } from '$types/data';
import Color from 'color';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { useContext, useState } from 'react';

/**
 * Stories page
 */
export default function StoriesPage({ heading, stories }: any) {
  const router = useRouter(),
    { settings } = useContext(GlobalData),
    sortedStories = stories.sort((a: any, b: any) => a.position - b.position),
    [activeStory, setActiveStory] = useState<number>(),
    hasActive = typeof activeStory !== 'undefined';

  function handleNav() {
    const { slug } = sortedStories[activeStory!];
    router.push(`/stories/${slug}`);
  }

  usePageLayout(
    {
      header: {
        fixed: hasActive,
        additionalClasses: hasActive ? 'opacity-0' : ''
      }
    },
    [hasActive]
  );

  return (
    <>
      <Meta
        title={settings.seo_stories_title}
        description={settings.seo_stories_description}
        image={settings.seo_stories_image}
      />
      <PageGrid
        className="transform translate-y-7"
        style={{ marginBottom: '-2rem' }}
      >
        <h1 className="mx-auto my-8 font-bold text-center font-display text-1xl sm:text-2xl md:text-4xl md:my-24">
          {heading}
        </h1>

        <CardStack
          className="!col-span-full"
          onEject={setActiveStory}
          onEjectFinish={handleNav}
          ejected={activeStory}
        >
          {sortedStories.map(
            (
              { slug, position, title, hero_image, color, authors }: any,
              i: number
            ) => (
              <div className="block cursor-pointer" key={slug}>
                <Head>
                  <link rel="preload" as="image" href={hero_image.src} />
                </Head>
                {activeStory !== i && (
                  <div
                    className="flex px-[var(--page-gutter)] relative items-center justify-center md:justify-between label text-xsm h-13 md:h-8"
                    style={{
                      background: color || 'white',
                      color: Color(color || '#ffffff').isDark()
                        ? 'white'
                        : 'black'
                    }}
                  >
                    <div className="flex items-center">
                      <NumberLabel
                        className="mr-2 !absolute md:!relative left-[var(--page-gutter)] md:left-0"
                        number={position}
                        small
                        outlined
                      />
                      <h2 className="text-center leading-5 tracking-wide max-w-[280px] md:max-w-none">
                        {title}
                      </h2>
                    </div>
                    <span className="hidden md:block">{`By ${authors
                      .map(
                        ({ first_name, last_name }: Author) =>
                          `${first_name} ${last_name}`
                      )
                      .join(' / ')}`}</span>
                  </div>
                )}
                <HeroImg
                  className={`transition-transform duration-500 ${
                    activeStory === i ? '-translate-y-20 md:-translate-y-8' : ''
                  }`}
                  style={{ background: color || 'white' }}
                  image={hero_image}
                  color={color}
                />
              </div>
            )
          )}
        </CardStack>
      </PageGrid>
      <NavBar
        period={{ start: '1600', end: 'Present' }}
        className="!fixed bottom-0 left-0 w-full z-50"
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
      heading: settings.stories_index_heading,
      stories: stories.data
    }
  };
};
