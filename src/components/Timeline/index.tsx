import { BREAKPOINTS } from '$src/lib/consts';
import { GlobalData } from '$src/lib/GlobalData';
import { useBreakpoint } from '$src/lib/hooks';
import { useTimeline } from '$src/stores/useTimeline';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect } from 'react';
import { Meta } from '../Meta';
import DesktopView from './DesktopView';
import MobileView from './MobileView';

export type TimelineProps = {
  data: any;
};

/**
 * ### Timeline visualization component
 */
export function Timeline({ data }: TimelineProps) {
  const isMobile = useBreakpoint(`(max-width: ${BREAKPOINTS.lg})`),
    { settings } = useContext(GlobalData);

  return (
    <>
      <Meta
        title={settings.seo_timeline_title}
        description={settings.seo_timeline_description}
        image={settings.seo_timeline_image}
      />
      <div className="relative flex justify-center w-full timeline">
        {isMobile ? <MobileView data={data} /> : <DesktopView data={data} />}
      </div>
    </>
  );
}
