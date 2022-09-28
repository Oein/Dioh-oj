import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7648972371680937"
          crossOrigin="anonymous"
        ></script>
        <meta name="author" content="Oein , Dina"></meta>
        <meta
          name="description"
          content="DiohOJ is a online judge website for who enjoies coding."
        ></meta>
        <meta property="og:title" content="DiohOJ"></meta>
        <meta
          name="og:description"
          content="DiohOJ is a online judge website for who enjoies coding."
        ></meta>
        <meta
          name="google-site-verification"
          content="axAJTWFc4-IbKQBDijFtNzJmNMfBbbrQLMcy4VdKA4g"
        />

        <meta
          name="og:image"
          content="https://cdn.discordapp.com/attachments/1018073277635252264/1018353701330636851/DALLE_2022-09-10_11.43.06_-_penguin_pixel_art.png"
        />
        <link
          rel="icon"
          href="https://cdn.discordapp.com/attachments/1018073277635252264/1018353701330636851/DALLE_2022-09-10_11.43.06_-_penguin_pixel_art.png"
        ></link>
        <link
          rel="shortcut icon"
          href="https://cdn.discordapp.com/attachments/1018073277635252264/1018353701330636851/DALLE_2022-09-10_11.43.06_-_penguin_pixel_art.png"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
