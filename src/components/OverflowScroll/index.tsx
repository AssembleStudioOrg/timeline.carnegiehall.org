import { ReactComponent as NavIcon } from '$src/assets/icons/nav-arrow.svg';
import { Children, HTMLProps, useEffect, useRef, useState } from 'react';
import { InView } from 'react-intersection-observer';
import { useMeasure, useScroll } from 'react-use';
import { PageGrid } from '../PageGrid';

const INTERSECTION_PROP = 'data-inview';

export type OverflowScrollProps = {
  withNav?: boolean;
  disabled?: boolean;
  fullwidth?: boolean;
  containerClasses?: string;
  navOffset?: number;
} & HTMLProps<HTMLDivElement>;

function Nav({
  direction,
  hidden,
  offset = 0,
  ...props
}: {
  direction: 'previous' | 'next';
  hidden: boolean;
  offset?: number;
} & HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={`absolute group top-0 cursor-pointer flex items-center h-full w-24 to-black from-transparent z-20 ${
        hidden && 'hidden'
      } ${
        direction === 'previous'
          ? 'left-0 bg-gradient-to-l'
          : 'right-0 bg-gradient-to-r justify-end'
      }`}
      {...props}
    >
      <div
        style={offset ? { marginTop: `${offset}px` } : {}}
        className={`inline-flex items-center justify-center rounded-full w-7 h-7 border border-grey-100 group-hover:bg-grey-100 ${
          direction === 'previous' ? 'rotate-180 ml-6' : 'mr-6'
        }`}
      >
        <NavIcon
          className={`w-3 h-3 fill-[white] group-hover:fill-[black] translate-x-px`}
        />
      </div>
    </div>
  );
}

/**
 * ### Panel with horizontal overflowing items
 */
export function OverflowScroll({
  disabled = false,
  withNav,
  fullwidth,
  children,
  navOffset,
  className = '',
  containerClasses = ''
}: OverflowScrollProps) {
  const container = useRef(null),
    scrollRef = useRef(null),
    [hasItems, setHasItems] = useState({ previous: false, next: false }),
    { x } = useScroll(scrollRef),
    [measureRef, { width }] = useMeasure();

  function getItem(item: 'next' | 'previous') {
    if (!container?.current) {
      return;
    }

    const hiddenItems = [].slice.call(
        (container?.current as any).querySelectorAll(
          `[${INTERSECTION_PROP}="false"]`
        )
      ),
      previousItem = [...hiddenItems]
        .reverse()
        .find((item) => (item as any).getBoundingClientRect().x < 0),
      nextItem = hiddenItems.find(
        (item) => (item as any).getBoundingClientRect().x > 0
      );

    return item === 'next' ? nextItem : previousItem;
  }

  function goTo(item: 'next' | 'previous') {
    if (!container.current) {
      return;
    }

    const items = [].slice.call(
        (container.current as any).querySelectorAll(`[${INTERSECTION_PROP}]`)
      ),
      target = getItem(item);

    if (!target) {
      return;
    }

    let alignment = 'end';

    if (item === 'next') {
      alignment = 'end';
    } else {
      alignment = items.indexOf(target) <= 0 ? 'center' : 'end';
    }

    (target as any).scrollIntoView({
      block: 'nearest',
      inline: alignment,
      behavior: 'smooth'
    });
  }

  useEffect(() => {
    if (withNav) {
      setTimeout(() => {
        const previous = !!getItem('previous'),
          next = !!getItem('next');
        setHasItems({ previous, next });
      }, 1);
    }
  }, [x, width, withNav, setHasItems]);

  return (
    <>
      <style jsx>{`
        .inner > :global(*) {
          flex-shrink: 0;
        }
      `}</style>

      <div
        ref={measureRef as any}
        className={`relative !col-span-full ${className}`}
      >
        <Nav
          hidden={!withNav || !hasItems.previous}
          direction="previous"
          offset={navOffset}
          onClick={() => goTo('previous')}
        />
        <PageGrid ref={scrollRef} className={`${!disabled && 'scrollable'}`}>
          <div
            ref={container}
            className={`inner flex ${fullwidth && '!col-start-1'}`}
          >
            {Children.map(children, (child) => (
              <InView threshold={0.9}>
                {({ inView, ref }) => {
                  return (
                    <div
                      ref={ref}
                      className={containerClasses}
                      data-inview={inView}
                    >
                      {child}
                    </div>
                  );
                }}
              </InView>
            ))}
            {!disabled && !fullwidth && (
              <div className="w-[var(--page-gutter)]" />
            )}
          </div>
        </PageGrid>
        <Nav
          hidden={!withNav || !hasItems.next}
          offset={navOffset}
          direction="next"
          onClick={() => goTo('next')}
        />
      </div>
    </>
  );
}
