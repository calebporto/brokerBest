import { Html, Head, Main, NextScript } from 'next/document'
import { useEffect } from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="modal-root"></div>
      </body>
    </Html>
  )
}
