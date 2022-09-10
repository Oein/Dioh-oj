import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        <Script
          async
          crossOrigin="anonymous"
          id="adsense"
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7648972371680937"
        />

        <meta
          name="viewport"
          content="viewport-fit=cover,width=device-width,"
        />
        <meta name="author" content="Oein , Dina"></meta>
        <meta
          name="description"
          content="Dioh is a online judge website for who enjoies coding."
        ></meta>
        <meta property="og:title" content="Dioh"></meta>

        <meta
          name="google-site-verification"
          content="axAJTWFc4-IbKQBDijFtNzJmNMfBbbrQLMcy4VdKA4g"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
