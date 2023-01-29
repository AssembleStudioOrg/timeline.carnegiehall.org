import { GlobalPlayer } from '$src/components/AudioPlayer/lib/GlobalPlayer';
import { Footer } from '$src/components/Footer';
import { Header } from '$src/components/Header';
import { PageGrid } from '$src/components/PageGrid';
import { cms } from '$src/lib/cms';
import { MUSICKIT_SCRIPT } from '$src/lib/consts';
import { GlobalData } from '$src/lib/GlobalData';
import { useLayout } from '$src/stores/useLayout';
import '$src/styles/index.css';
import { DefaultSeo } from 'next-seo';
import type { AppContext, AppProps } from 'next/app';
import NextApp from 'next/app';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import GTM from 'react-gtm-module';
import smoothscroll from 'smoothscroll-polyfill';

function App({
  Component,
  pageProps,
  footer,
  stories,
  genres,
  performers,
  settings,
  menu
}: AppProps & any) {
  const [ready, setReady] = useState(false),
    page = useLayout(useCallback((s) => s.page, []));

  useEffect(() => {
    setTimeout(() => setReady(true), 10);
    smoothscroll.polyfill();
    GTM.initialize({
      gtmId: process.env.NEXT_PUBLIC_GTM_ID || ''
    });
  }, []);

  return (
    <>
      <Head>
        {/* Meta */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#16140e" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon.png" />

        {/* Fonts */}
        <link rel="stylesheet" href="https://use.typekit.net/qqu3zvc.css" />

        {/* Musickit */}
        <script src={MUSICKIT_SCRIPT} async />
      </Head>

      <DefaultSeo
        titleTemplate="%s — Timeline of African American Music"
        title={settings.site_name}
        openGraph={{
          type: 'website',
          locale: 'en',
          url: process.env.NEXT_PUBLIC_SITE_URL,
          site_name: settings.site_name
        }}
      />

      {/* Page */}
      <GlobalData.Provider
        value={{
          footer,
          stories,
          genres,
          settings,
          menu,
          performers
        }}
      >
        <div
          className="grid grid-cols-[var(--grid-page)] auto-rows-min min-h-screen"
          style={{ gridTemplateRows: 'auto 1fr auto' }}
        >
          <Header />
          <PageGrid
            className={ready ? '' : 'invisible'}
            rows={page.rows}
            as="main"
          >
            <Component {...pageProps} />
          </PageGrid>
          <Footer />
        </div>
        <GlobalPlayer />
      </GlobalData.Provider>
    </>
  );
}

// Should be getStaticProps, but not supported in _app yet
// See https://github.com/vercel/next.js/discussions/10949
App.getInitialProps = async (appContext: AppContext) => {
  const [stories, genres, performers, footer, settings, menu] =
    await Promise.all([
      cms(`v2/stories`),
      cms(`v2/genres`),
      cms('v2/notable-performers'),
      cms('footer'),
      cms('site-settings'),
      cms('v2/menus/1')
    ]);

  return {
    ...(await NextApp.getInitialProps(appContext)),
    stories: stories.data,
    genres: genres.data,
    // TODO: Remove once endpoint cleaned up
    performers: performers.map(({ id, slug, name, show_in_menu }: any) => ({
      id,
      slug,
      name,
      show_in_menu
    })),
    footer,
    settings,
    menu
  };
};

export default App;
