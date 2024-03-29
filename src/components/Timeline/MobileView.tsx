import Sankey from '$src/components/Sankey';
import Years from '$src/components/Years';
import { MOBILE_YEAR_HEIGHT } from '$src/lib/consts';
import { useMemo, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { useSwipeable } from 'react-swipeable';
import { LeftButton, RightButton } from './buttons';
import { computeCanvasSize, computeStats } from './compute';

export type Props = {
  data: any;
};

const MobileView = ({ data }: Props) => {
  const [viewCursor, setViewCursor] = useState(0);
  const { minYear, maxYear, canvasHeight } = computeCanvasSize(
    data,
    MOBILE_YEAR_HEIGHT
  );
  const stats = useMemo(() => computeStats(data), [data]);
  const views = [...stats.traditions].sort();

  const { width, ref } = useResizeDetector({
    handleHeight: false
  });

  const slideLeft = () => {
    if (viewCursor >= views.length - 1) return;
    setViewCursor(viewCursor + 1);
  };
  const slideRight = () => {
    if (viewCursor <= 0) return;
    setViewCursor(viewCursor - 1);
  };

  const handlers = useSwipeable({
    onSwipedLeft: (e) => slideLeft(),
    onSwipedRight: (e) => slideRight(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const view = (views as any)[viewCursor];

  return (
    <>
      <Years
        minYear={minYear}
        maxYear={maxYear}
        yearHeight={MOBILE_YEAR_HEIGHT}
      />
      <div
        className="absolute top-0 w-full pl-16 pr-2 overflow-hidden"
        {...handlers}
      >
        <div className="canvas" ref={ref} style={{ height: canvasHeight }}>
          <Sankey
            width={width * views.length}
            height={canvasHeight}
            minYear={minYear}
            maxYear={maxYear}
            data={data}
            containerProps={{
              style: {
                transform: `translate(${-width * viewCursor}px, 0)`,
                transition: 'transform 0.5s'
              }
            }}
          />
        </div>
      </div>
      <div
        className="fixed flex items-center w-11/12 px-4 py-2 text-center text-white rounded-md px bottom-10 shadow-card"
        style={{ backgroundColor: stats.colors.get(view) }}
      >
        <LeftButton onClick={() => slideRight()} />
        <span className="w-full font-bold">{view}</span>
        <RightButton onClick={() => slideLeft()} />
      </div>
    </>
  );
};

export default MobileView;
