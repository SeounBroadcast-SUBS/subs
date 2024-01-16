"use client";

import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [appearence, setAppearence] = useState("");

  useEffect(() => {
    const v = localStorage.getItem("appearence");
    setAppearence(!v ? "light" : v);
  }, []);

  return (
    <>
      <div className="nav">
        <button
          id="menu-btn"
          onClick={() => {
            const sideMenu = document.querySelector("aside");
            sideMenu.style.display = "block";
          }}
        >
          <span className="material-icons-sharp"> menu </span>
        </button>
        <div
          className="dark-mode"
          onClick={() => {
            document.body.classList.toggle("dark-mode-variables");

            const newAppearence = appearence === "dark" ? "light" : "dark";
            setAppearence(newAppearence);
            localStorage.setItem("appearence", newAppearence);
          }}
        >
          <span
            className={
              appearence === "dark"
                ? "material-icons-sharp active"
                : "material-icons-sharp"
            }
          >
            dark_mode
          </span>
          <span
            className={
              appearence === "light"
                ? "material-icons-sharp active"
                : "material-icons-sharp"
            }
          >
            light_mode
          </span>
        </div>
      </div>
    </>
  );
};

export default Navbar;
