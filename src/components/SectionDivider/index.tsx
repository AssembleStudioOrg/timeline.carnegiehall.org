import type { HTMLProps } from 'react';

const Line = ({ length }: { length: BarLength }) => {
  const lengths = {
    standard: 'h-[64px] sm:h-[100px]',
    'extra-short': 'h-[28px] sm:h-[48px]',
    short: 'h-[28px] sm:h-[96px]',
    long: 'h-[180px] sm:h-[280px]',
    none: 'h-0'
  };

  return (
    <div
      className={`w-px ${lengths[length]}`}
      style={{ background: 'currentColor' }}
    />
  );
};

type BarLength = 'standard' | 'short' | 'long' | 'extra-short' | 'none';

export type SectionDividerProps = {
  /** Style of top divider to use */
  dividers?: {
    top: BarLength;
    bottom: BarLength;
  };
} & HTMLProps<HTMLDivElement>;

/**
 * ### Divider between section, with content inside
 */
export function SectionDivider({
  dividers = {
    top: 'standard',
    bottom: 'standard'
  },
  children,
  className = ''
}: SectionDividerProps) {
  return (
    <section className={`lazyrender flex flex-col items-center ${className}`}>
      <Line length={dividers.top} />
      {children}
      <Line length={dividers.bottom} />
    </section>
  );
}
