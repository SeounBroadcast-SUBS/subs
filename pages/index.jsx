"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import logo from "@/public/logo192.png";

import { useState, useEffect } from "react";

export default function Home() {
  const [isDomLoaded, setIsDomLoaded] = useState(false);

  useEffect(() => {
    setIsDomLoaded(true);
  }, []);

  return (
    <>
      {isDomLoaded && (
        <>
          <main>
            <div className="wraper">
              <h1>SUBS</h1>
              <p className="info-text">
                SUBS: "Seoun Broadcasting System"의 약자
              </p>
              <p className="info-text">
                서운중학교 방송부(A.K.A. SUBS)는 서운중학교의 동아리이며,
                점심시간 음악방송, 교내방송, 서운축제 등 교내의 방송을
                담당합니다.
              </p>
              <p className="info-text">
                2023년 현재 방송부장을 포함, 총 14명의 방송부원이 서운중학교의
                방송부를 이끌어가고 있습니다.
              </p>
            </div>
            <div className="wraper">
              <h2>FAQ</h2>
              <div className="faq-wraper">
                <p className="faq-text">
                  Q: 점심시간 음악방송의 음악 선정은 어떻게 이루어지나요?
                </p>
                <p className="faq-text">
                  A: 웹사이트에서 점심시간에 재생될 음악 신청곡을 받습니다. 그
                  후 방송부원들이 신청곡 중 음악을 선정하여 음악을 재생합니다.
                  신청곡이 신청했되었으나, 신청곡이 재생되지 않을 수 있습니다.
                </p>
              </div>
              <div className="faq-wraper">
                <p className="faq-text">Q: 방송부원은 어떻게 선출되나요?</p>
                <p className="faq-text">
                  A: 방송부원은 학기 초 (3~4월)에 모집 공고가{" "}
                  <a href="https://seoun.sen.ms.kr/" className="faq-text-a">
                    서운중학교 공식 홈페이지
                  </a>
                  와 교내에 계시됩니다.
                </p>
              </div>
              <div className="faq-wraper">
                <p className="faq-text">Q: 방송부 사이트 만든 사람 이름 딱대</p>
                <p className="faq-text">
                  A: 방송부 사이트 개발자의 신상정보는 다음과 같습니다 :)
                  <br />
                  <span className="info">
                    이름: 강구현 <br />
                    학번: 21201
                    <br />
                    메일주소: gangguhyeon1113@gmail.com
                    <br />
                    인스타 아이디: @kgh_guhyeon
                    <br />
                  </span>
                  건의사항이나 따질 점은 건의사항 신청으로 :)
                </p>
              </div>
            </div>
          </main>
          <div className="right-section">
            <Navbar />
            <div className="wraper">
              <div className="nft-box">
                <div style={{ width: "240px", height: "240px" }}>
                  <Image alt="SUBS Logo" src={logo} width={240} height={240} />
                </div>
                <div className="nft-content">
                  <div className="info">
                    <div>
                      <p>SUBS Logo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
