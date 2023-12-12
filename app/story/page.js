"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";

import LoadingScreen from "../loading";
import Navbar from "../Navbar";

const Story = () => {
  const [studentNumber, setStudentNumber] = useState("anonymous");
  const [name, setName] = useState("");
  const [story, setStory] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [singer, setSinger] = useState("");

  const [activeSelection, setActiveSelection] = useState("anonymous");

  const [isLoad, setIsLoad] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (songTitle === "" || singer === "" || story === "") {
      return;
    }

    setIsLoad(true);

    // Send the request to the server
    fetch(
      "https://cuddly-eureka-g4q65777rrr439675-3000.app.github.dev/add-story",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          songTitle: songTitle,
          name: name,
          story: story,
          singer: singer,
          studentNumber: studentNumber,
        }),
      }
    )
      .then((response) => {
        Swal.fire({
          title: "신청 시 주의사항",
          html: `<p>신청 시 주의사항을 한번 더 확인해주세요!</p>
          <h3>사연 속 등장인물의 이름은 알파벳이나 기호로 대체하여 보내주세요.</h3>
          <h3>타인을 비방하거나 모욕하는 사연은 보낼 수 없습니다.</h3>
          <h3>부적절한 어휘(욕설, 은어 등)을 사용하여 사연을 작성하지 않습니다.</h3>`,
        }).then(() => {
          if (response.ok) {
            // Request successful
            setIsLoad(false);
            Swal.fire({
              icon: "success",
              title: "Thank you!",
              text: "사연이 신청되었습니다.",
            });
          } else {
            // Request failed
            response.json().then((data) => {
              setIsLoad(false);
              Swal.fire({
                icon: "error",
                title: "Error!",
                text: `${data.message}`,
              });
            });
          }
        });
      })
      .catch((error) => {
        setIsLoad(false);
        Swal.fire({
          icon: "info",
          text:
            "오류가 발생했습니다. 개발자에게 연락주세요: @kgh_guhyeon. 오류 메세지: An error occurred while making the request. ERROR:" +
            error,
          title: "Error!",
        });
        console.error(error);
      });
  };

  const anonymous = (
    <form className="wraper story">
      <h1>Story Request</h1>
      <div className="input-info">
        <span className="material-icons-sharp"> person </span>
        <p>신청자 이름:</p>
      </div>
      <input
        className="inputs"
        type="text"
        id="user-name"
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
      <div className="input-info">
        <span className="material-icons-sharp"> pin </span>
        <p>학번:</p>
      </div>
      <input
        className="inputs"
        type="text"
        id="school-number"
        onChange={(event) => {
          setStudentNumber(event.target.value);
        }}
      />
      <div className="input-info">
        <span className="material-icons-sharp"> lyrics </span>
        <p>신청곡 제목:</p>
      </div>
      <input
        className="inputs"
        type="text"
        id="song-name"
        onChange={(event) => {
          setSongTitle(event.target.value);
        }}
      />
      <div className="input-info">
        <span className="material-icons-sharp"> album </span>
        <p>가수:</p>
      </div>
      <input
        className="inputs"
        type="text"
        id="artist"
        onChange={(event) => {
          setSinger(event.target.value);
        }}
      />

      <div className="input-info">
        <span className="material-icons-sharp"> feed </span>
        <p>사연:</p>
      </div>
      <input
        className="inputs"
        type="text"
        id="artist"
        onChange={(event) => {
          setStory(event.target.value);
        }}
      />

      <button type="submit" className="submit-btn" onClick={handleSubmit}>
        신청하기
      </button>
    </form>
  );

  const realname = (
    <form className="wraper story">
      <h1>Story Request</h1>
      <div className="input-info">
        <span className="material-icons-sharp"> lyrics </span>
        <p>신청곡 제목:</p>
      </div>
      <input
        className="inputs"
        type="text"
        id="song-name"
        onChange={(event) => {
          setSongTitle(event.target.value);
        }}
      />
      <div className="input-info">
        <span className="material-icons-sharp"> album </span>
        <p>가수:</p>
      </div>
      <input
        className="inputs"
        type="text"
        id="artist"
        onChange={(event) => {
          setSinger(event.target.value);
        }}
      />

      <div className="input-info">
        <span className="material-icons-sharp"> feed </span>
        <p>사연:</p>
      </div>
      <input
        className="inputs"
        type="text"
        id="artist"
        onChange={(event) => {
          setStory(event.target.value);
        }}
      />

      <button type="submit" className="submit-btn" onClick={handleSubmit}>
        신청하기
      </button>
    </form>
  );

  return (
    <>
      {isLoad ? <LoadingScreen /> : ""}

      <main>
        <div className="select">
          <button
            className={
              activeSelection === "anonymous"
                ? "wraper select-anonymous active"
                : "wraper select-anonymous"
            }
            onClick={() => {
              setName("anonymous")
              setStudentNumber("anonymous")
              setActiveSelection("anonymous");
            }}
          >
            <p className="selection">익명</p>
          </button>
          <button
            className={
              activeSelection === "realname"
                ? "wraper select-anonymous active"
                : "wraper select-anonymous"
            }
            onClick={() => setActiveSelection("realname")}
          >
            <p className="selection">실명</p>
          </button>
        </div>

        {activeSelection === "realname" ? realname : anonymous}
      </main>
      <div className="right-section">
        <Navbar />
        <div className="wraper">
          <p className="info-text">신청 시 주의사항:</p>
          <li>
            사연 속 등장인물의 이름은 알파벳이나 기호로 대체하여 보내주세요.
          </li>
          <li>타인을 비방하거나 모욕하는 사연은 보낼 수 없습니다.</li>
          <li>
            부적절한 어휘(욕설, 은어 등)을 사용하여 사연을 작성하지 않습니다.
          </li>
        </div>
      </div>
    </>
  );
};

export default Story;
