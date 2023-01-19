import type { HTMLProps } from 'react';

export type NumberLabelProps = HTMLProps<HTMLDivElement> & {
  /** Number for label */
  number: number;
  /** Whether should be outlined style */
  outlined?: boolean;
  /** Whether should stay small */
  small?: boolean;
  noBlend?: boolean;
};

/**
 * ### Simple circled number
 */
export function NumberLabel({
  number,
  small,
  outlined,
  noBlend,
  className = ''
}: NumberLabelProps) {
  return (
    <div
      className={`relative rounded-full w-[18px] h-[18px]
      ${!small && `sm:w-7 sm:h-7`}
      ${
        outlined
          ? `border`
          : `bg-black text-white ${!noBlend && 'mix-blend-multiply'}`
      }
      ${className}
      `}
    >
      <span
        className={`block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-ui tracking-tighter text-xs sm:text-sm ${
          !small && 'sm:text-base sm:font-bold'
        }`}
      >
        {number}
      </span>
    </div>
  );
}
