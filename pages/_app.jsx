import "@/styles/main.css";
import Head from "next/head";
import RootLayout from "@/components/layout";

export default function App({ Component }) {
  return (
    <>
      <Head>
        <title>서운중학교 방송부</title>
      </Head>
      <RootLayout>
        <Component />
      </RootLayout>
    </>
  );
}
