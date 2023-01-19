import { Accordion, AccordionProps } from '.';

export default {
  title: 'Components/Accordion',
  component: Accordion
};

export const Default = (props: AccordionProps) => (
  <Accordion {...props} />
);