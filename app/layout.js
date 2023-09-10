"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [activeComponent, setActiveComponent] = useState("intro");

  useEffect(() => {
    document.querySelectorAll(".logo-div").forEach((e) => {
      e.innerHTML = `<img src="./logo192.png" />`;
    });
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo192.png" />
        <title>서운중학교 방송부</title>
        <meta
          name="naver-site-verification"
          content="b816fc58b692e18ad86238f0b555c8e6c3a142d5"
        />
        <meta
          name="google-site-verification"
          content="jYqO_4s8MpFSeSPYlk0DrRYZPyIb_MKP4vaI8ujnB8k"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="서운중학교 방송부 웹사이트" />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <div className="container">
          <aside>
            <div className="toggle">
              <div
                className="logo"
                style={{ alignItems: "center", display: "flex" }}
              >
                <div className="logo-div"></div>
                <h2>
                  SU<span className="danger">BS</span>
                  <br />
                </h2>
              </div>
              <div
                className="close"
                id="close-btn"
                onClick={() => {
                  const sideMenu = document.querySelector("aside");
                  sideMenu.style.display = "none";
                }}
              >
                <span className="material-icons-sharp"> close </span>
              </div>
            </div>

            <div className="sidebar">
              <Link
                className={activeComponent === "intro" ? "active" : ""}
                onClick={() => {
                  setActiveComponent("intro");
                }}
                href="/"
              >
                <span className="material-icons-sharp"> dashboard </span>
                <h3>SUBS 소개</h3>
              </Link>

              <Link
                className={activeComponent === "songRequest" ? "active" : ""}
                onClick={() => {
                  setActiveComponent("songRequest");
                }}
                href="/song-request"
              >
                <span className="material-icons-sharp"> lyrics </span>
                <h3>음악 신청</h3>
              </Link>

              <Link
                className={activeComponent === "suggestion" ? "active" : ""}
                onClick={() => {
                  setActiveComponent("suggestion");
                }}
                href="/suggestion-request"
              >
                <span className="material-icons-sharp"> mail_outline </span>
                <h3>건의사항</h3>
              </Link>

              <Link
                className={activeComponent === "schedule" ? "active" : ""}
                onClick={() => {
                  setActiveComponent("schedule");
                }}
                href="schedule"
              >
                <span className="material-icons-sharp"> calendar_month </span>
                <h3>방송일정</h3>
                {/* <span className="message-count"></span> */}
              </Link>

              <Link
                className={activeComponent === "story" ? "active" : ""}
                onClick={() => {
                  setActiveComponent("story");
                }}
                href="/story"
              >
                <span className="material-icons-sharp"> feed </span>
                <h3>사연신청</h3>
                {/* <span className="message-count"></span> */}
              </Link>

              <a>
                {/* <span className="material-icons-sharp"> logout </span> */}
                <h3>SUBS</h3>
              </a>
            </div>
          </aside>
          {/* ------------------------------ Child Component Here ------------------------------ */}
          {children}
        </div>
      </body>
    </html>
  );
}
