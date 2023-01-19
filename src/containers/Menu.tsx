import { Button } from '$src/components/Button';
import { Link } from '$src/components/Link';
import { PageGrid } from '$src/components/PageGrid';
import { GlobalData } from '$src/lib/GlobalData';
import { useBreakpoint } from '$src/lib/hooks';
import { resolveMenuLink } from '$src/lib/cms';
import { useLayout } from '$src/stores/useLayout';
import { Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { HTMLProps, useContext, useEffect, useState } from 'react';
import shallow from 'zustand/shallow';
import { SearchResults } from './Navigation/lib/SearchResults';
import { Navigation } from './Navigation/Navigation';

export type MenuProps = HTMLProps<HTMLDivElement>;

/**
 * ### Global site menu and about page
 */
export function Menu({ className, ...props }: MenuProps) {
  const { menu } = useContext(GlobalData),
    [config, updateLayout] = useLayout((s) => [s.menu, s.update], shallow),
    timing = (duration: string | number) =>
      `${config.asPage ? '[0ms]' : `[${duration}ms]`}`,
    [nav, setNav] = useState<'explore' | 'stories' | 'genres' | 'performers'>(
      'explore'
    ),
    router = useRouter(),
    isDesktop = useBreakpoint('(min-width: 768px)'),
    [view, setView] = useState<'nav' | 'menus'>('nav'),
    [search, setSearch] = useState<string | null>(null);

  useEffect(() => {
    if (config.open) {
      setNav('explore');
      setView('nav');
    }
  }, [config.open]);

  useEffect(() => {
    setSearch(null);
  }, [nav]);

  const NavItem = ({ label, active, href, onClick, ...props }: any) => {
    const El = href ? Link : ('span' as any);

    return (
      <li
        onClick={() => {
          !href && setView('menus');
          onClick && onClick();
        }}
        className="my-2 text-lg font-bold md:text-2xl font-display"
        {...props}
      >
        <El
          href={href}
          className={`cursor-pointer hover:border-b hover:border-red ${
            active ? 'md:border-b md:border-red' : ''
          }`}
        >
          {label}
        </El>
      </li>
    );
  };

  return (
    <Transition
      as={PageGrid as any}
      className={`bg-black-300 overflow-hidden ${className}`}
      enterFrom="opacity-0"
      enterTo="opacity-1"
      leaveFrom="opacity-1"
      leaveTo="opacity-0"
      enter={`transition-opacity duration-${timing(500)}`}
      leave="transition-opacity duration-500 delay-[750ms]"
      show={config.open}
      {...props}
    >
      <Transition.Child
        as={PageGrid}
        rows="auto 1fr"
        unmount={false}
        className="h-screen bg-black-300 text-grey-100"
        enterFrom="opacity-0"
        enterTo="opacity-1"
        leaveFrom="opacity-1"
        leaveTo="opacity-0"
        enter={`transition-opacity duration-${timing(500)}`}
        leave="transition-opacity duration-500 delay-[700ms]"
      >
        <Transition.Child
          as={PageGrid}
          unmount={false}
          rows="1fr"
          className="items-center text-black bg-grey-100  h-13 md:h-[72px]"
          enterFrom="-translate-y-full"
          enterTo="translate-y-0"
          leaveFrom="translate-y-0"
          leaveTo="-translate-y-full"
          enter={`transition-transform duration-${timing(300)} delay-${timing(
            400
          )}`}
          leave="transition-transform duration-300"
        >
          <div className="flex items-center">
            <input
              className="flex-1 mr-4 text-sm font-bold bg-transparent md:text-md font-display placeholder:text-grey-700 placeholder:opacity-1"
              value={search || ''}
              onChange={({ target }) => setSearch(target.value)}
              placeholder="Search by story, genre, or performer..."
            />
            <Button
              className={!search ? 'invisible' : ''}
              small
              onClick={() => setSearch(null)}
            >
              Clear
            </Button>
          </div>
        </Transition.Child>

        <Transition.Child
          as={PageGrid}
          unmount={false}
          className="px-5 bg-black-300 scrollable md:px-0"
          enterFrom="opacity-0"
          enterTo="opacity-1"
          leaveFrom="opacity-1"
          leaveTo="opacity-0"
          enter={`transition-opacity duration-${timing(300)} delay-${timing(
            '[500ms]'
          )}`}
          leave="transition-opacity duration-300"
        >
          <div className="md:flex pt-13">
            {!isDesktop && !search && (
              <span
                className="inline-block mb-6 cursor-pointer text-grey-700"
                onClick={() => {
                  if (view === 'menus') {
                    setView('nav');
                  } else {
                    router.push('/');
                    updateLayout({ menu: { open: false } });
                  }
                }}
              >
                {view === 'nav' ? ' Return Home' : 'Back'}
              </span>
            )}
            {(isDesktop || (view === 'nav' && !search)) && (
              <div className="md:mr-14">
                <nav className="md:sticky md:top-13 md:whitespace-nowrap">
                  {isDesktop && (
                    <Link
                      href="/"
                      className="block mb-6 text-grey-700 hover:text-white"
                    >
                      Return Home
                    </Link>
                  )}
                  <ul>
                    <NavItem
                      label="My Explorations"
                      active={nav === 'explore' && !search}
                      onClick={() => setNav('explore')}
                    />
                    <div className="my-6">
                      <NavItem href="/timeline" label="Timeline" />
                      <NavItem
                        label="Stories"
                        active={nav === 'stories' && !search}
                        onClick={() => setNav('stories')}
                      />
                      <NavItem
                        label="Genres"
                        active={nav === 'genres' && !search}
                        onClick={() => setNav('genres')}
                      />
                      <NavItem
                        label="Performers"
                        onClick={() => setNav('performers')}
                        active={nav === 'performers' && !search}
                      />
                    </div>
                    {menu.items.map((link: any) => (
                      <NavItem
                        label={link.title}
                        href={resolveMenuLink(link)}
                        key={link.id}
                      />
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            {(isDesktop || !!search || view === 'menus') && (
              <div className="pb-32">
                {!!search ? (
                  <SearchResults search={search as string} />
                ) : (
                  <Navigation nav={nav} />
                )}
              </div>
            )}
          </div>
        </Transition.Child>
      </Transition.Child>
    </Transition>
  );
}
