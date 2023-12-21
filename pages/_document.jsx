import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/logo192.png" />
          <meta
            name="google-site-verification"
            content="8G2KydASuYKSemKztK4MhB2wmyWQ-FWi-7VXrcrClWA"
          />
          <meta name="description" content="서운중학교 방송부 웹사이트" />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
