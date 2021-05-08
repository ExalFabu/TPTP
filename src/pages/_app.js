import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="description" content="Calcola la tua media universitaria" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tptp.vercel.app/" />
        <meta property="og:title" content="TPTP" key="og:title" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta
          property="og:description"
          content="Calcola la tua media universitaria"
          key="og:description"
        />
        <meta property="og:image" content="/logo1262.png" />
        <meta property="og:site_name" content="TPTP" />
        <meta property="og:locale" content="it_IT" />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:url" content="https://tptp.vercel.app/" />
        <meta property="twitter:title" content="TPTP" key="twitter:title" />
        <meta
          property="twitter:description"
          content="Calcola la tua media universitaria"
          key="twitter:description"
        />
        <meta property="twitter:image" content="/logo1262.png" />
        {/* <!-- 1200×628 --> */}

        <link rel="apple-touch-icon" href="/logo192.png" />

        <script
          async
          src={'https://www.googletagmanager.com/gtag/js?id=G-NDMGLF3H9S'}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', 'G-NDMGLF3H9S');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
            {
              "@context": "https://schema.org/",
              "@type": "WebApplication",
              "name": "TPTP",
              "url": "https://tptp.vercel.app",
              "description": "Calcola la tua media universitaria",
              "image": "/logo512.png",
              "alternateName": "TPTP - Calcola la tua media universitaria",
              "keywords": "università, media, unipa, calcolo media",
              "applicationCategory": "Utility",
              "operatingSystem": "Windows, Linux, MacOS, iOS, Android",
              "softwareVersion": "2.0"
            }
            `,
          }}
        />
      </Head>
      <ColorModeScript initialColorMode="system" />
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
