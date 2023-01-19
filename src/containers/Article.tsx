import { Accordion } from '$src/components/Accordion';
import { AuthorCredit } from '$src/components/AuthorCredit';
import { HTML } from '$src/components/HTML';
import { Map } from '$src/components/Map';
import { MediaScroller } from '$src/components/MediaScroller';
import { PageGrid } from '$src/components/PageGrid';
import { PullQuote } from '$src/components/PullQuote';
import { RelatedGenres } from '$src/components/RelatedGenres';
import { SectionDivider } from '$src/components/SectionDivider';
import { SectionTitle } from '$src/components/SectionTitle';
import { plaintext } from '$src/lib/utils';
import type { Author } from '$types/data';
import { forwardRef, HTMLProps } from 'react';

export type ArticleProps = {
  leadIn?: boolean;
  content: {
    type: string;
    children?: any[];
    content?: any;
  }[];
  authors?: Author[];
} & HTMLProps<HTMLDivElement>;

export const ARTICLE_CONTAINER_STYLES = 'pb-24 z-10 bg-grey-100 relative';
export const ARTICLE_SECTION_LAYOUT = `max-w-4xl w-full lazyrender mx-auto`;
export const ARTICLE_TEXT_STYLES = 'font-body text-lg md:text-xl richtext';

const DIVIDERS = ['title', 'block-quote', 'accordion'];

export const Article = forwardRef(function Article(
  { leadIn = true, content, authors, className }: ArticleProps,
  ref
) {
  const Section = ({ type, children, index, className = '' }: any) => {
    const isDividers = DIVIDERS.includes(type),
      Wrapper = isDividers ? SectionDivider : 'section',
      dividersBefore = DIVIDERS.includes(content[index - 1]?.type),
      dividersAfter = DIVIDERS.includes(content[index + 1]?.type);

    return (
      <Wrapper
        className={`${index === 0 && 'mt-13 md:mt-12'} ${
          !dividersBefore && !isDividers && 'mt-6'
        } ${!dividersAfter && !isDividers && 'mb-6'} ${className}`}
        dividers={{
          top: index === 0 && leadIn ? 'long' : 'standard',
          bottom: dividersAfter ? 'none' : 'standard'
        }}
      >
        {children}
      </Wrapper>
    );
  };

  return (
    <PageGrid ref={ref} className={`font-body z-10 ${className}`}>
      {content.map(({ type, children, content, ...props }: any, i: number) => {
        switch (type) {
          case 'title':
            return (
              <Section
                type={type}
                index={i}
                className="flex flex-col items-center"
                key={i}
              >
                <SectionTitle title={content.text} />
              </Section>
            );
          case 'text':
            return (
              <Section
                type={type}
                index={i}
                className={`${ARTICLE_SECTION_LAYOUT} ${ARTICLE_TEXT_STYLES}`}
                key={i}
              >
                <HTML content={content.text} />
              </Section>
            );
          case 'block-quote':
            return (
              <Section
                type={type}
                index={i}
                className="flex flex-col items-center !mt-0 !mb-0"
                key={i}
              >
                <PullQuote
                  quote={plaintext(content.quote)}
                  author={content.person}
                  role={content.title}
                />
              </Section>
            );
          case 'media-collection':
            return (
              <Section type={type} index={i} className="!grid subgrid" key={i}>
                <MediaScroller
                  media={children.map(
                    ({
                      content,
                      media_full_url,
                      medias,
                      music_videos
                    }: any) => {
                      const video =
                          (music_videos &&
                            music_videos[0].apple_music_video_attributes
                              .preview_video_url) ||
                          content.vimeo_url ||
                          content.youtube_url,
                        image =
                          media_full_url ||
                          (music_videos &&
                            music_videos[0].apple_music_video_attributes.artwork?.url
                              .replace('{w}', '1600')
                              .replace('{h}', '900'));

                      return {
                        caption: plaintext(content.caption),
                        credit: content.credit,
                        creditLink: content.credit_link,
                        type: !!video ? 'video' : 'image',
                        media: image,
                        alt: medias[0]?.alt_text,
                        url: video
                      };
                    }
                  )}
                />
              </Section>
            );
          case 'info-text':
            return (
              <Section
                type={type}
                index={i}
                className={`${ARTICLE_SECTION_LAYOUT} font-ui text-sm  richtext`}
                key={i}
              >
                <HTML content={content.text} />
              </Section>
            );
          case 'author-reference':
            return (
              <Section
                className="max-w-4xl mx-auto"
                type={type}
                index={i}
                key={i}
              >
                {authors?.map((author: Author, i: number) => (
                  <AuthorCredit author={author} key={i} />
                ))}
              </Section>
            );
          case 'accordion':
            return (
              <Section
                className={`${ARTICLE_SECTION_LAYOUT} ${ARTICLE_TEXT_STYLES}`}
                type={type}
                index={i}
                key={i}
              >
                <Accordion items={children} />
              </Section>
            );
          case 'map':
            return (
              <Section
                className="w-full max-w-4xl mx-auto"
                type={type}
                index={i}
                key={i}
              >
                <Map
                  center={{
                    lat: Number(props.center.lat),
                    lng: Number(props.center.lng)
                  }}
                  zoom={4}
                  markers={props.items.map(({ lat, lng, name, url }: any) => ({
                    position: { lat: Number(lat), lng: Number(lng) },
                    name,
                    url
                  }))}
                />
              </Section>
            );
          case 'related-genres':
            return (
              <Section type={type} index={i} key={i}>
                <RelatedGenres
                  themes={props.themes}
                  features={props['musical-features']}
                  instruments={props.instruments}
                />
              </Section>
            );
          case 'all-authors':
            return (
              <Section
                className={`${ARTICLE_SECTION_LAYOUT} ${ARTICLE_TEXT_STYLES}`}
                type={type}
                index={i}
                key={i}
              >
                <Accordion
                  items={props.authors.map((author: any) => ({
                    title: `${author.first_name} ${author.last_name}`,
                    content: `<p><a href="${author.link}">${
                      author.first_name
                    } ${author.last_name}</a> ${author.bio.replace(
                      /(?:^<p[^>]*>)/g,
                      ''
                    )}`
                  }))}
                />
              </Section>
            );
        }
      })}
    </PageGrid>
  );
});
