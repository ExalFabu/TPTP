import Head from 'next/head'
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>TPTP</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <meta name="description" content="Calcola il voto finale e la tua media universitaria" />
                {/* Facebook meta tags*/}
                <meta property="og:title" content="TPTP" key="og:title" />
                <meta
                    property="og:description"
                    content="Calcola il voto finale e la tua media universitaria"
                    key="og:description"
                />
                <meta property="og:url" content="https://tptp.vercel.app/" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://tptp.vercel.app/logo1262.png" />
                <meta property="og:site_name" content="TPTP" />
                <meta property="og:locale" content="it" />
                {/* Twitter meta tags*/}
                <meta property="twitter:title" content="TPTP" key="twitter:title" />
                <meta
                    property="twitter:description"
                    content="Calcola il voto finale e la tua media universitaria"
                    key="twitter:description"
                />
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:url" content="https://tptp.vercel.app/" />
                <meta property="twitter:image" content="https://tptp.vercel.app/logo1262.png" />
                <link rel="apple-touch-icon" href="https://tptp.vercel.app/logo192.png" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: `
            {
              "@context": "https://schema.org/",
              "@type": "WebApplication",
              "name": "TPTP",
              "url": "https://tptp.vercel.app",
              "description": "Calcola il voto finale e la tua media universitaria",
              "image": "htpps://tptp.vercel.app/logo512.png",
              "alternateName": "TPTP - Calcola il voto finale e la tua media universitaria",
              "keywords": "università, media, unipa, calcolo media",
              "applicationCategory": "Utility",
              "operatingSystem": "Windows, Linux, MacOS, iOS, Android",
              "softwareVersion": "2.0"
            }
            `,
                    }}
                />
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
            </Head>
            <Component {...pageProps} />
        </>
    )
}