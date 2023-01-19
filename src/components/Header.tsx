import { ReactComponent as Logo } from '$src/assets/img/logo.svg';
import { Menu } from '$src/containers/Menu';
import { BREAKPOINTS } from '$src/lib/consts';
import { useBreakpoint } from '$src/lib/hooks';
import { onKeyAction } from '$src/lib/utils';
import { useLayout } from '$src/stores/useLayout';
import { useRouter } from 'next/dist/client/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import _Headroom from 'react-headroom';
import { useKeyPressEvent } from 'react-use';
import shallow from 'zustand/shallow';
import { HamburgerIcon } from './Hamburger';
import { Link } from './Link';
import { NavBar } from './NavBar';
import { PageGrid } from './PageGrid';

const Headroom = _Headroom as any;

/**
 * ### Global site header
 */
export function Header() {
  const [config, menu, updateLayout] = useLayout(
      (s) => [s.header, s.menu, s.update],
      shallow
    ),
    isMobile = useBreakpoint(`(max-width: ${BREAKPOINTS.lg})`),
    ref = useRef<HTMLElement>(null),
    router = useRouter(),
    { menu: page } = router.query,
    [activeTheme, setActiveTheme] = useState(config.theme);

  function closeMenu() {
    updateLayout({ menu: { asPage: false, open: false } });
    setTimeout(() => setActiveTheme(config.theme), 900);
  }

  const openMenu = useCallback(() => {
    setActiveTheme('default');
    updateLayout({ menu: { ...menu, open: true } });
  }, [setActiveTheme, menu, updateLayout]);

  function toggleMenu() {
    if (menu.open) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  useEffect(() => {
    const close = () => {
      if (!page) {
        updateLayout({ menu: { asPage: false, open: false } });
        setTimeout(() => setActiveTheme(config.theme), 900);
      }
    };
    router.events.on('routeChangeComplete', close);
    return () => router.events.off('routeChangeComplete', close);
  }, [router.events, config.theme, page, updateLayout]);

  useEffect(() => {
    document.documentElement.style.overflow = menu.open ? 'hidden' : '';
  }, [menu]);

  useEffect(() => {
    if (!!page) {
      setActiveTheme('default');
      setTimeout(
        () =>
          updateLayout({
            menu: { asPage: true, page: page as any, open: true }
          }),
        0
      );
    }
  }, [page, updateLayout]);

  useEffect(() => {
    setActiveTheme(config.theme);
  }, [config.theme]);

  useKeyPressEvent('Escape', () => closeMenu);

  return (
    <>
      <style jsx global>{`
        .headroom--unpinned {
          position: fixed;
          transform: translateY(
            ${menu.open ? '0' : config.withNavBar ? '-52%' : '-100%'}
          ) !important;
        }
      `}</style>

      <div
        className={`z-[999] !col-span-full w-full ${
          config.fixed && 'absolute'
        }`}
      >
        <Headroom>
          <PageGrid
            as="header"
            ref={ref}
            className={`relative z-[999] before:absolute before:top-0 before:w-full before:h-full before:bg-grey-100 ${
              !menu.asPage && 'before:transition-opacity'
            } border-t-[10px] md:border-t-[12px] border-b
          ${
            activeTheme === 'minimal' &&
            'text-grey-100  before:opacity-0 border-black border-b-0'
          }
          ${activeTheme === 'default' && 'text-black !before:opacity-1 '}
          ${config.additionalClasses}
        `}
            style={{ transition: 'color' }}
          >
            <div className="relative z-10 flex items-center justify-between col-span-1 col-start-2 h-13 md:h-[72px]">
              <Link className="hidden lg:block" href="/" aria-label="Home">
                <Logo className="w-10 h-10 logo" />
              </Link>

              <Link
                href="/"
                className="text-sm font-bold font-display lg:text-base"
              >
                Timeline of African American Music
              </Link>

              <HamburgerIcon
                role="button"
                className="!h-2 !w-6 lg:!h-3 lg:!w-7 hover:text-red transition-all"
                open={menu.open!}
                duoLine
                tabIndex={0}
                lineWidth={isMobile ? '2px' : '3px'}
                onClick={toggleMenu}
                onKeyDown={onKeyAction(toggleMenu)}
                aria-label="Open menu"
              />
            </div>
          </PageGrid>
          <div className="fixed left-0 w-full z-[998]">
            <Menu />
          </div>
          {config.withNavBar && (
            <NavBar
              direction="down"
              period={config.withNavBar?.period}
              title={config.withNavBar?.title}
              cta={config.withNavBar?.cta}
              highlight={config.withNavBar?.highlight}
            />
          )}
        </Headroom>
      </div>
    </>
  );
}
