"use client";

import React, { useState, useEffect } from "react";

import Navbar from "../Navbar";
import LoadingScreen from "../loading";
import Swal from "sweetalert2";

const Schedule = () => {
  const [isLoad, setIsLoad] = useState(0);

  const [board, setBoard] = useState(<></>);

  const [titleInput, setTitleInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [periodInput, setPeriodInput] = useState("");
  const [groupInput, setGroupInput] = useState("");
  const [linkInput, setLinkInput] = useState("");

  const [isRefresh, setIsRefresh] = useState(0);

  const getSchedule = () => {
    fetch(
      "https://port-0-subs-backend-4fju66f2clmuhrt4d.sel5.cloudtype.app/view-schedule"
    ).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setBoard(
            data.map((schedule, index) => (
              <div key={index} className="content-wraper">
                <div className="contentNav">
                  <div className="contentNav-text">
                    <span className="material-icons-sharp content">
                      {" "}
                      calendar_month{" "}
                    </span>
                    <p>{schedule.date}</p>
                  </div>

                  <div className="contentNav-text">
                    <span className="material-icons-sharp content">
                      {" "}
                      schedule{" "}
                    </span>
                    <p>{schedule.period}교시</p>
                  </div>

                  <div className="contentNav-text">
                    <span className="material-icons-sharp content">
                      {" "}
                      person{" "}
                    </span>
                    <p>{schedule.group}조</p>
                  </div>
                </div>

                <div className="contentMain">
                  <p
                    className="info-text schedule"
                    onClick={() => {
                      window.open(schedule.link);
                    }}
                  >
                    {schedule.title}
                  </p>
                </div>
              </div>
            ))
          );
        });
      }
    });
  };

  useEffect(() => {
    setIsLoad(true);
    getSchedule();
    setIsLoad(false);
  }, [isRefresh]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      titleInput === "" ||
      dateInput === "" ||
      periodInput === "" ||
      groupInput === ""
    ) {
      return;
    }

    Swal.fire({
      title: "비밀번호를 입력하세요",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "확인",
      showLoaderOnConfirm: true,
      preConfirm: (password) => {
        if (password === "서운중방송부1111") {
          fetch(
            "https://port-0-subs-backend-4fju66f2clmuhrt4d.sel5.cloudtype.app/add-schedule",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: titleInput,
                date: dateInput,
                period: periodInput,
                group: groupInput,
                link: linkInput,
              }),
            }
          );
        }
      },
    }).then((data) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "방송 일정이 성공적으로 추가되었습니다.",
      }).then(() => {
        setIsRefresh((prev) => (prev ? 0 : 1));
      });
    });
  };

  return (
    <>
      {isLoad ? <LoadingScreen /> : ""}
      <main>
        <div className="wraper">
          <h1>방송일정</h1>
          {board}
        </div>
      </main>
      <div className="right-section">
        <Navbar />
        <form className="wraper">
          <h1>방송일정 추가하기</h1>

          <div className="input-info">
            <span className="material-icons-sharp"> title </span>
            <p>방송제목:</p>
          </div>
          <input
            className="inputs"
            type="text"
            placeholder="예) 생명존중교육"
            onChange={(event) => {
              setTitleInput(event.target.value);
            }}
          />

          <div className="input-info">
            <span className="material-icons-sharp"> calendar_month </span>
            <p>방송일:</p>
          </div>
          <input
            className="inputs"
            type="date"
            onChange={(event) => {
              setDateInput(event.target.value);
            }}
          />

          <div className="input-info">
            <span className="material-icons-sharp"> schedule </span>
            <p>방송시간 (?교시):</p>
          </div>
          <input
            className="inputs"
            type="text"
            placeholder="예) 6"
            onChange={(event) => {
              setPeriodInput(event.target.value);
            }}
          />

          <div className="input-info">
            <span className="material-icons-sharp"> group </span>
            <p>조 (?조):</p>
          </div>
          <input
            className="inputs"
            type="text"
            placeholder="예) 3"
            onChange={(event) => {
              setGroupInput(event.target.value);
            }}
          />

          <div className="input-info">
            <span className="material-icons-sharp"> attachment </span>
            <p>방송링크 (없으면 스페이스바 한번):</p>
          </div>
          <input
            className="inputs"
            type="text"
            onChange={(event) => {
              setLinkInput(event.target.value);
            }}
          />

          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            신청하기
          </button>
        </form>
      </div>
    </>
  );
};

export default Schedule;
