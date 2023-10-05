"use client";

import { useEffect, useState } from "react";
import styles from "./loading.module.css";

const LoadingScreen = () => {
  const [appearence, setAppearence] = useState("");

  useEffect(() => {
    const appear = localStorage.getItem("appearence");
    if (localStorage.getItem("appearence") === null) {
      localStorage.setItem("appearence", "light");
      setAppearence(appear);
    } else {
      setAppearence(appear);
    }

    console.log(appearence);
  }, []);
  return (
    <>
      {console.log(appearence)}
      {appearence === "dark" ? (
        <>
          <main>
            <div className={styles.skeleton_main_dark}></div>
          </main>
          <div className="right-section">
            <div className={styles.skeleton_right_dark}></div>
          </div>
        </>
      ) : (
        <>
          <main>
            <div className={styles.skeleton_main}></div>
          </main>
          <div className="right-section">
            <div className={styles.skeleton_right}></div>
          </div>
        </>
      )}
    </>
  );
};

export default LoadingScreen;
