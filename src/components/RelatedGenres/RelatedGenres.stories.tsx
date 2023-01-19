import { RelatedGenres, RelatedGenresProps } from '.';

export default {
  title: 'Components/RelatedGenres',
  component: RelatedGenres
};

export const Default = (props: RelatedGenresProps) => (
  <RelatedGenres {...props} />
);