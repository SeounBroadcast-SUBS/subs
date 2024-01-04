import { Inter } from "next/font/google";
import "@/styles/main.css";
import PageLayout from "@/components/pageLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SUBS",
  description: "Seoun Middle School Broadcasting System",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
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
      </head>
      <body className={inter.className}>
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  );
}
