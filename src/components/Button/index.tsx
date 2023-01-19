import type { ReactNode } from 'react';
import { Link } from '../Link';

export type ButtonProps = {
  small?: Boolean;
  children: ReactNode;
} & any;

/**
 * ### Adaptive button component
 */
export function Button({
  children,
  small,
  className = '',
  ...props
}: ButtonProps) {
  const Element = props.href ? Link : 'button';

  return (
    <Element
      className={`label  tracking-widest text-center rounded-full border transition-all bg-grey-100  hover:bg-black hover:text-grey-100 ${className} ${
        small ? 'py-1 px-4 text-xxs' : 'text-xsm py-2 px-6'
      }`}
      {...props}
    >
      {children}
    </Element>
  );
}
