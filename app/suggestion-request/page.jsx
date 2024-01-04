"use client";

import React, { useState, useEffect } from "react";

import Navbar from "@/components/Navbar";
import FetchLoadingScreen from "@/components/fetchLoading";

import Swal from "sweetalert2";

export default function SuggestionRequest() {
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

  const getSuggestionRequest = () => {
    fetch("/api/suggestion-request")
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setSuggestionContent(
            <div>
              <p className="label-list">아직 신청된 건의사항이 없습니다.</p>
            </div>
          );
        } else {
          setSuggestionContent(
            data.map((suggestion, index) => (
              <div key={index}>
                <p className="label-list">
                  <span>Q: {suggestion.suggestion}</span>
                  <br />
                  <span>
                    A:{" "}
                    {suggestion.answer === ""
                      ? "답변이 진행중입니다..."
                      : suggestion.answer}
                  </span>
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
    fetch("/api/suggestion-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
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
      {isLoad ? <FetchLoadingScreen /> : ""}
      <main>
        <div className="wraper">
          <h1>Suggestion Request</h1>
          <br />
          {suggestionContent}
        </div>
      </main>
      <div className="right-section">
        <Navbar />
        <form className="wraper">
          <h2>Request</h2>
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
}
