import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createTheme } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NoSSR from "react-no-ssr";
import Head from "next/head";

import { useEffect } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const darkTheme = createTheme({
  type: "light",
  theme: {
    colors: {},
  },
});

const lightTheme = createTheme({
  type: "light",
  theme: {
    colors: {},
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const start = () => {
      NProgress.start();
    };
    const end = () => {
      NProgress.done();
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <NoSSR>
      <SessionProvider session={pageProps.session}>
        <NextThemesProvider
          defaultTheme="system"
          attribute="class"
          value={{
            light: lightTheme.className,
            dark: darkTheme.className,
          }}
        >
          <NextUIProvider>
            <div
              style={{
                marginTop: "76px",
                padding: "5px",
              }}
            >
              <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
              />
              <Head>
                <meta
                  name="viewport"
                  content="viewport-fit=cover,width=device-width,"
                />
              </Head>
              <Component {...pageProps} />
            </div>
          </NextUIProvider>
        </NextThemesProvider>
      </SessionProvider>
    </NoSSR>
  );
}

export default MyApp;
