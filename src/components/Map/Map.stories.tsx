import { Map, MapProps } from '.';

export default {
  title: 'Components/Map',
  component: Map
};

export const Default = (props: MapProps) => (
  <Map {...props} />
);