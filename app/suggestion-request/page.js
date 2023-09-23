"use client";

import React, { useState, useEffect } from "react";

import Navbar from "../Navbar";
import LoadingScreen from "../loading";

import Swal from "sweetalert2";

const SuggestionRequest = () => {
  const [suggestion, setSuggestion] = useState("");
  const [name, setName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");

  const [suggestionContent, setSuggestionContent] = useState([]);

  const [isLoad, setIsLoad] = useState(0);

  const [isRefresh, setIsRefresh] = useState(false);

  const refreshSuggesionRequest = () => {
    if (isRefresh === 0) {
      setIsRefresh(1);
    } else {
      setIsRefresh(0);
    }
    document.querySelectorAll(".wraper")[1].reset();
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

  const getSuggestionRequest = () => {
    fetch(
      "https://port-0-subs-backend-4fju66f2clmuhrt4d.sel5.cloudtype.app/view-suggestion" // https://port-0-seounbss-backend-otjl2cli677tyd.sel4.cloudtype.app
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          // No requested suggestions
        } else {
          setSuggestionContent(
            data.map((suggestion, index) => (
              <div key={index} className="">
                <p className="label-list">
                  <span>Q: {suggestion.suggestion}</span>
                  <br />
                  <span>A: {suggestion.answer}</span>
                </p>
              </div>
            ))
          );
        }
      })
      .catch((error) => {
        console.error(
          'An error occurred while requesting a HTTP to a server, Method: "GET". error code:',
          error
        );
      });
  };

  useEffect(() => {
    getSuggestionRequest();
  }, [isRefresh]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (suggestion === "" || name === "" || studentNumber === "") {
      return;
    }

    setIsLoad(true);

    // Create a request object
    const request = {
      name,
      studentNumber,
      suggestion,
    };

    // Send the request to the server
    fetch(
      "https://port-0-subs-backend-4fju66f2clmuhrt4d.sel5.cloudtype.app/suggestion-request", // https://port-0-seounbss-backend-otjl2cli677tyd.sel4.cloudtype.app
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    )
      .then((response) => {
        if (response.ok) {
          // Request successful
          setIsLoad(false);
          Swal.fire({
            icon: "success",
            title: "Thank you!",
            text: "건의사항이 신청되었습니다.",
          }).then(() => {
            refreshSuggesionRequest();
          });
        } else {
          // Request failed
          response.json().then((data) => {
            setIsLoad(false);
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: data.message,
            }).then(() => {
              refreshSuggesionRequest();
            });
          });
        }
      })
      .catch((error) => {
        Swal.fire(
          "Info!",
          "An error occurred while making the request. ERROR:" + error,
          "info"
        );
        console.error(error);
      });
  };
  return (
    <>
      {isLoad ? <LoadingScreen /> : ""}
      <main>
        <div className="wraper">
          <h1>신청 목록:</h1>
          <br />
          {suggestionContent}
        </div>
      </main>
      <div className="right-section">
        <Navbar />
        <form className="wraper">
          <h1>Suggestion Request</h1>
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
            <span className="material-icons-sharp"> mail </span>
            <p>건의 내용:</p>
          </div>
          <input
            className="inputs"
            type="text"
            id="suggestion"
            onChange={(event) => {
              setSuggestion(event.target.value);
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

export default SuggestionRequest;
