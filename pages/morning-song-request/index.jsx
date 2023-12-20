"use client";

import React, { useState, useEffect } from "react";

import Navbar from "@/components/Navbar";
import FetchLoadingScreen from "@/components/fetchLoading";

import Swal from "sweetalert2";

export default function MorningSongRequest() {
  const [songTitle, setSongTitle] = useState("");
  const [singer, setSinger] = useState("");
  const [name, setName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");

  const [songList, setSongList] = useState([]);

  const [isLoad, setIsLoad] = useState(false);

  const refreshSongList = () => {
    fetch("/api/morning-song-request")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.data.length === 0) {
          setSongList(["아직 신청된 곡이 없습니다."]);
        } else {
          const songLabels = data.data.map(
            (song) => `${song.songTitle} - ${song.singer}`
          );
          setSongList(songLabels);
        }
      });
    setSongTitle("");
    setSinger("");
    setName("");
    setStudentNumber("");
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-right",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  useEffect(() => {
    fetch("/api/morning-song-request")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.data.length === 0) {
          setSongList(["아직 신청된 곡이 없습니다."]);
        } else {
          const songLabels = data.data.map(
            (song) => `${song.songTitle} - ${song.singer}`
          );
          setSongList(songLabels);
        }
      });

    // Swal.fire({
    //   icon: "info",
    //   title: "죄송합니다.",
    //   html: `
    //   <p>
    //     2023년 8월 24일 NCT와 BTS의 노래가 신청되지 않는 현상이 발생했습니다.
    //     이는 방송부 사이트 개발자가 동일한 가수의 신청곡을 신청하지 못하도록 하는 기능을 개발중에 일어난 참사입니다. 죄송합니다. <br /> <br />
    //     하지만, 동일한 가수의 신청곡이 다양한 편법(예: "b t s", "bts)")으로 신청되는 것은 점심시간 음악신청 신청 시 주의사항을 위반하는 것이므로 블랙리스트에 추가될 수 있습니다.
    //     노래 신청 전에 동일한 가수의 신청곡이 있는지 꼭 확인하고 신청하여 주시기 바랍니다.
    //   </p>`,
    // });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      songTitle === "" ||
      singer === "" ||
      name === "" ||
      studentNumber === ""
    ) {
      return;
    }

    setIsLoad(true);

    // Create a request object
    const request = {
      name,
      studentNumber,
      songTitle,
      singer,
    };

    // Send the request to the server
    fetch("/api/morning-song-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((response) => {
        Swal.fire({
          title: "신청 시 주의사항",
          html: `<p>신청 시 주의사항을 한번 더 확인해주세요!</p>
          <h3>건전한 노래만 신청해주세요.</h3>
          <h3>일본노래, 이세계아이돌, 보컬로이드 등은 신청하지 말아주세요.</h3>
          <h3>본인이 직접 신청해주세요.</h3>
          <h3>중복된 가수의 노래 신청은 하지 말아주세요.</h3>`,
        }).then(() => {
          if (response.ok) {
            // Request successful
            setIsLoad(false);
            Swal.fire({
              icon: "success",
              title: "Thank you!",
              text: "노래가 신청되었습니다.",
            }).then(() => {
              refreshSongList();
            });
          } else {
            // Request failed
            response.json().then((data) => {
              setIsLoad(false);
              Swal.fire({
                icon: "error",
                title: "Error!",
                text: `${data.message}`,
              }).then(() => {
                refreshSongList();
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

  return (
    <>
      {isLoad ? <FetchLoadingScreen /> : <></>}

      <main>
        <form className="wraper">
          <h1>Morning Song Request</h1>
          <div className="input-info">
            <span className="material-icons-sharp"> person </span>
            <p>신청자 이름:</p>
          </div>
          <input
            className="inputs"
            type="text"
            id="user-name"
            value={name}
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
            value={studentNumber}
            onChange={(event) => {
              setStudentNumber(event.target.value);
            }}
          />
          <div className="input-info">
            <span className="material-icons-sharp"> lyrics </span>
            <p>노래 제목:</p>
          </div>
          <input
            className="inputs"
            type="text"
            id="song-name"
            value={songTitle}
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
            value={singer}
            onChange={(event) => {
              setSinger(event.target.value);
            }}
          />

          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            신청하기
          </button>
        </form>
      </main>
      <div className="right-section">
        <Navbar />
        <div className="wraper">
          <h2>Precautions</h2>
          <li className="label-list">건전한 노래만 신청해주세요.</li>
          <li className="label-list">
            일본노래, 이세계아이돌, 보컬로이드 등은 신청하지 말아주세요.
          </li>
          <li className="label-list">본인이 직접 신청해주세요.</li>
          <li className="label-list">
            중복된 가수의 노래 신청은 하지 말아주세요.
          </li>
        </div>
        <div className="wraper">
          <h2>List</h2>
          {songList.map((song, index) => (
            <li
              key={index}
              className="label-list"
              onClick={() => {
                navigator.clipboard.writeText(song);
                Toast.fire({
                  icon: "success",
                  title: "복사되었습니다.",
                });
              }}
            >
              {song}
            </li>
          ))}
        </div>
      </div>
    </>
  );
}
