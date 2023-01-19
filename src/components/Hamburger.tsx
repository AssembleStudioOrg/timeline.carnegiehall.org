/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';

export type HamburgerIconProps = {
  /** Whether the icon is in an open state */
  open: boolean;
  /** Whether to show only 2 lines */
  duoLine?: boolean;
  /** Opening animation configuration
   * @param duration How long the transition lasts
   * @param easing The easing function used
   */
  animation?: { duration: number; easing: string };
  /**
   * Width of the Hamburger lines <br />
   * Specified as any valid CSS value
   */
  lineWidth?: string;
};

/**
 * Animated hamburger menu icon
 */
export function HamburgerIcon({
  open,
  duoLine,
  animation = {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  lineWidth = '2px',
  ...props
}: HamburgerIconProps) {
  const lineStyles = css`
    position: absolute;
    background: currentColor;
    transition: ${open
      ? `top ${animation.duration}ms 50ms ${animation.easing}, transform ${
          animation.duration
        }ms ${animation.duration + 50}ms ${animation.easing};`
      : `top ${animation.duration}ms ${animation.duration + 50}ms ${
          animation.easing
        }, transform ${animation.duration}ms 50ms ${animation.easing};`};
    width: 100%;
    height: ${lineWidth};
    border-radius: ${lineWidth};
    ${open &&
    css`
      top: 50% !important;
    `}
  `;

  return (
    <div
      css={css`
        cursor: pointer;
        height: 1rem;
        width: 1.5rem;
        position: relative;
      `}
      {...props}
    >
      <span
        css={[
          lineStyles,
          css`
            top: 0;
          `,
          open &&
            css`
              transform: rotate(45deg);
            `
        ]}
      />
      {!duoLine && (
        <span
          css={[
            lineStyles,
            css`
              top: 50%;
            `,
            open &&
              css`
                transform: rotate(45deg);
              `
          ]}
        />
      )}
      <span
        css={[
          lineStyles,
          css`
            top: 100%;
          `,
          open &&
            css`
              transform: rotate(-45deg);
            `
        ]}
      />
    </div>
  );
}
