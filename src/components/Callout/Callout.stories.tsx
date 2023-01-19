import { Callout, CalloutProps } from '.';

export default {
  title: 'Components/Callout',
  component: Callout
};

export const Default = ({
  label = 'View Performances at Carnegie Hall',
  href = 'https://carnegiehall.org'
}: CalloutProps) => <Callout label={label} href={href} />;
