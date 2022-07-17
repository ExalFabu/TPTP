import { ColorModeScript } from '@chakra-ui/react';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="it">
        <Head>
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
        <ColorModeScript initialColorMode={"system"} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
