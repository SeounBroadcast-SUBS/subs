"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import logo from "@/public/logo192.png";

export default function PageLayout({ children }) {
  const [activeComponent, setActiveComponent] = useState("");

  useEffect(() => {
    setActiveComponent(window.location.href.split("/").pop());
    if (localStorage.getItem("appearence") === "dark") {
      document.body.className += " dark-mode-variables";
    }
  }, []);

  return (
    <>
      <div className="container">
        <aside>
          <div className="toggle">
            <div
              className="logo"
              style={{ alignItems: "center", display: "flex" }}
            >
              <Image alt="SUBS Logo" src={logo} width={42} height={42} />
              <h2 className="typo-logo">
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
              className={activeComponent === "" ? "active" : ""}
              onClick={() => {
                setActiveComponent("");
              }}
              href="/"
            >
              <span className="material-icons-sharp"> dashboard </span>
              <h3>SUBS</h3>
            </Link>

            <Link
              className={activeComponent === "song-request" ? "active" : ""}
              onClick={() => {
                setActiveComponent("song-request");
                console.log(activeComponent);
              }}
              href="/song-request"
            >
              <span className="material-icons-sharp"> lyrics </span>
              <h3>점심시간 음악신청</h3>
            </Link>

            <Link
              className={
                activeComponent === "suggestion-request" ? "active" : ""
              }
              onClick={() => {
                setActiveComponent("suggestion-request");
              }}
              href="/suggestion-request"
            >
              <span className="material-icons-sharp"> mail_outline </span>
              <h3>건의사항</h3>
            </Link>

            <Link
              className={
                activeComponent === "morning-song-request" ? "active" : ""
              }
              onClick={() => {
                setActiveComponent("morning-song-request");
              }}
              href="/morning-song-request"
            >
              <span className="material-icons-sharp"> calendar_month </span>
              <h3>등굣길 음악신청</h3>
            </Link>
            <a>
              <h3>SUBS</h3>
            </a>
          </div>
        </aside>
        {children}
      </div>
    </>
  );
}
