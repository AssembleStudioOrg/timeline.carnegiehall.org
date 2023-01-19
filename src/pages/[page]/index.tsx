import { Button } from '$src/components/Button';
import { Heading } from '$src/components/Heading';
import { Meta } from '$src/components/Meta';
import { NavBar } from '$src/components/NavBar';
import { PageGrid } from '$src/components/PageGrid';
import { ScrollProgress } from '$src/components/ScrollProgress';
import { SectionDivider } from '$src/components/SectionDivider';
import { Article, ARTICLE_SECTION_LAYOUT } from '$src/containers/Article';
import { cms } from '$src/lib/cms';
import type { GetStaticPaths, GetStaticProps } from 'next';

/**
 * Story page
 */
export default function StaticPage({ data }: any) {
  return (
    <>
      <ScrollProgress />

      <Meta {...data.seo} />

      <NavBar
        cta={{ label: 'Explore Stories', href: '/stories' }}
        direction="down"
        period={{
          start: '1600',
          end: '2020'
        }}
      />

      <PageGrid className="py-10 text-grey-100 bg-black-300 md:py-24">
        <div className={`${ARTICLE_SECTION_LAYOUT} text-center`}>
          <Heading heading={data.title} />
          <SectionDivider
            dividers={{ top: 'extra-short', bottom: 'extra-short' }}
            className="mt-5 md:mt-9"
          >
            <Button
              className="bg-transparent min-w-[170px] hover:bg-grey-100 hover:text-black-300"
              onClick={() => window.history.back()}
            >
              Back
            </Button>
          </SectionDivider>
        </div>
        <Article leadIn={false} content={data.content} />
      </PageGrid>
    </>
  );
}

/** Page data */
export const getStaticProps: GetStaticProps = async ({ params, preview }) => {
  const data = await cms(`v2/pages/${params?.page}`, { preview });

  return {
    props: {
      data
    }
  };
};

/** Static pages generation */
export const getStaticPaths: GetStaticPaths = async () => {
  const { data: pages } = await cms(`v2/pages`);

  return {
    paths: pages.map(({ slug, id }: any) => ({
      params: { page: slug, id }
    })),
    fallback: false
  };
};
