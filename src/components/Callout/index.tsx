import { Link } from '../Link';
import { ReactComponent as ArrowIcon } from '$src/assets/icons/arrow.svg';

export type CalloutProps = {
  /** Label for the callout */
  label: string;
  /** Link for the allout */
  href: string;
  /** Whether callout is in a list of callouts */
  list?: boolean;
} & any;

/**
 * ### Simple callout link
 */
export function Callout({ label, href, list, className = '' }: CalloutProps) {
  return (
    <Link
      href={href}
      className={`flex transition-colors hover:text-red border-black-300 justify-between items-center border-t py-4 ${className} ${
        list ? 'last:border-b' : 'border-b'
      }`}
    >
      <span className="pr-4 text-lg font-body md:text-xl">{label}</span>
      <ArrowIcon className="w-5 h-5 stroke-current" />
    </Link>
  );
}
