import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/logo192.png" />
          <meta
            name="naver-site-verification"
            content="b816fc58b692e18ad86238f0b555c8e6c3a142d5"
          />
          <meta
            name="google-site-verification"
            content="jYqO_4s8MpFSeSPYlk0DrRYZPyIb_MKP4vaI8ujnB8k"
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
