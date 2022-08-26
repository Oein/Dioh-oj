import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider, theme, useTheme } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createTheme } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

const darkTheme = createTheme({
  type: "light",
  theme: {
    colors: {},
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <NextThemesProvider
        defaultTheme="system"
        attribute="class"
        value={{
          light: darkTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider>
          <Component {...pageProps} />
        </NextUIProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}

export default MyApp;
