import type { ComponentProps } from 'react';
import Collapsible from 'react-collapsible';
import { ReactComponent as OpenIcon } from '$src/assets/icons/plus.svg';
import { ReactComponent as CloseIcon } from '$src/assets/icons/minus.svg';
import { SectionDivider } from '../SectionDivider';

export type AccordionProps = {
  /** Items for the accordion */
  items: { title: string; content: string }[];
} & ComponentProps<'div'>;

/**
 * ### Accordion list
 */

/**
 * ### Accordion with expandable items
 */
export function Accordion({ items, className, ...props }: AccordionProps) {
  const Trigger = ({ title, open }: any) => {
    const Icon = open ? CloseIcon : OpenIcon;

    return (
      <h3 className="flex items-center justify-between py-3 border-t md:py-4 group">
        {title}
        <Icon className="w-5 h-5 stroke-current md:w-7 md:h-7 group-hover:fill-current group-hover:stroke-black-300" />
      </h3>
    );
  };

  return (
    <div className={`${className || ''}`} {...props}>
      {items.map(({ title, content }, i) => (
        <Collapsible
          className="last:border-b"
          trigger={<Trigger title={title} />}
          triggerWhenOpen={<Trigger title={title} open={true} />}
          easing="ease"
          key={i}
        >
          <div
            className="pb-10 inline-richtext pt-7 md:pt-11 md:pb-14"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </Collapsible>
      ))}
    </div>
  );
}
