"use client";

import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [isDomLoaded, setIsDomLoaded] = useState(false);

  useEffect(() => {
    setIsDomLoaded(true);
    document.querySelectorAll(".logo-div").forEach((e) => {
      if (localStorage.getItem("appearence") === "dark") {
        e.innerHTML = `<img src="./logo192_black.png" />`;
      } else {
        e.innerHTML = `<img src="./logo192.png" />`;
      }
    });
  }, []);

  return (
    <>
      {isDomLoaded && (
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
              localStorage.setItem(
                "appearence",
                localStorage.getItem("appearence") === "dark" ? "light" : "dark"
              );

              if (localStorage.getItem("appearence") === "dark") {
                document.querySelectorAll(".logo-div").forEach((e) => {
                  console.log("Changing to dark image");
                  e.innerHTML = `<img src="./logo192_black.png" />`;
                });
              } else {
                document.querySelectorAll(".logo-div").forEach((e) => {
                  console.log("Changing to light image");
                  e.innerHTML = `<img src="./logo192.png" />`;
                });
              }
            }}
          >
            <span className="material-icons-sharp active">light_mode</span>
            <span className="material-icons-sharp">dark_mode</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
