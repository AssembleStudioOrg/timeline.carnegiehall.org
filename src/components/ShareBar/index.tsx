import { onKeyAction } from '$src/lib/utils';
import { useRouter } from 'next/dist/client/router';
import { HTMLProps, useState } from 'react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { DropdownModal } from '../DropdownModal';
import { PageGrid } from '../PageGrid';

export type ShareBarProps = {
  /** Citation for an article */
  citation: string;
} & HTMLProps<HTMLDivElement>;

const link = 'cursor-pointer transition-colors hover:!text-red label';

/**
 * ### Citation and social sharing links for articles
 */
export function ShareBar({ citation, className = '' }: ShareBarProps) {
  const [citationOpen, setCitationOpen] = useState(false),
    router = useRouter();

  return (
    <>
      <DropdownModal onClose={() => setCitationOpen(false)} open={citationOpen}>
        <p>{citation}</p>
      </DropdownModal>

      <PageGrid as="aside" className={`bg-grey-50 ${className}`}>
        <div className="flex justify-between w-full max-w-4xl col-start-2 col-end-3 mx-auto my-4 text-xsm">
          <span
            className={link}
            onClick={() => setCitationOpen(!citationOpen)}
            onKeyDown={onKeyAction(() => setCitationOpen(!citationOpen))}
            tabIndex={0}
          >
            Cite
          </span>
          <div className="label">
            <span>Share on &nbsp;</span>
            <FacebookShareButton
              className={link}
              url={`${process.env.NEXT_PUBLIC_SITE_URL}${router?.asPath}`}
              quote={citation}
            >
              Facebook
            </FacebookShareButton>
            <span className="inline-block mr-2">,</span>
            <TwitterShareButton
              className={link}
              url={`${process.env.NEXT_PUBLIC_SITE_URL}${router?.asPath}`}
              title={citation}
            >
              Twitter
            </TwitterShareButton>
          </div>
        </div>
      </PageGrid>
    </>
  );
}
