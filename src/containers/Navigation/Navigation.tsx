import { Explore } from './lib/Explore';
import { Genres } from './lib/Genres';
import { Performers } from './lib/Performers';
import { Stories } from './lib/Stories';

export function Navigation({
  nav
}: {
  nav: 'explore' | 'stories' | 'genres' | 'performers';
}) {
  switch (nav) {
    case 'explore':
      return <Explore />;
    case 'stories':
      return <Stories />;
    case 'genres':
      return <Genres />;
    case 'performers':
      return <Performers />;
    default:
      return null;
  }
}
