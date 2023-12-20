const { parse } = require("url");
const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 3000;
const app = next({ dev });

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "subs-7a132.firebaseapp.com",
  projectId: "subs-7a132",
  storageBucket: "subs-7a132.appspot.com",
  messagingSenderId: "618126276524",
  appId: "1:618126276524:web:da22c1abcdc78ed9d72c09",
  measurementId: "G-9W1YHRTQL6",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function getSongFirestore() {
  const todaySongRequest = { data: [] };

  const currentDateString = new Date()
    .toLocaleString("en-US", {
      timeZone: "Asia/Seoul",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    .split(", ")
    .join("-")
    .split(" ")
    .join("");

  const songRequestRef = await getDocs(collection(db, "song-request"));
  songRequestRef.forEach((doc) => {
    if (doc.id == currentDateString) {
      todaySongRequest["data"] = doc.data().data;
    }
  });

  return todaySongRequest;
}

async function getSuggestionFirestore() {
  const suggestion = { data: [] };
  const suggestionRef = await getDocs(collection(db, "suggestion-request"));
  suggestionRef.forEach((doc) => {
    if (doc.id === "requests") {
      suggestion["data"] = doc.data().data;
    }
  });

  return suggestion;
}

async function getMorningSongFirestore() {
  const todaySongRequest = { data: [] };

  const currentDateString = new Date()
    .toLocaleString("en-US", {
      timeZone: "Asia/Seoul",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    .split(", ")
    .join("-")
    .split(" ")
    .join("");

  const songRequestRef = await getDocs(collection(db, "morning-song-request"));
  songRequestRef.forEach((doc) => {
    if (doc.id == currentDateString) {
      todaySongRequest["data"] = doc.data().data;
    }
  });

  return todaySongRequest;
}

function isRequestValid(
  name,
  studentNumber,
  songTitle,
  singer,
  requestedSongs,
  blacklist,
  isValidObj
) {
  if (isValidObj.isValid === false) {
    return isValidObj.message;
  }

  const currentDateString = new Date()
    .toLocaleString("en-US", {
      timeZone: "Asia/Seoul",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    .split(", ")
    .join("-")
    .split(" ")
    .join("");

  // Check if it's a weekend (Saturday or Sunday)
  if (
    currentDateString.split("-")[0] === "Sat" ||
    currentDateString.split("-")[0] === "Sun"
  ) {
    return "주말에는 신청을 받지 않습니다.";
  }

  // Check if the maximum limit of 10 requests per day has been reached
  if (requestedSongs.data.length >= 10) {
    return "오늘 신청이 마감되었습니다. (10개)";
  }

  const strProcess = (str) =>
    str
      .toUpperCase()
      .replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, "")
      .trim()
      .split(" ")
      .join("");

  // Check if the same singer is already requested
  const singers = {
    bts_________: ["bts", "방탄소년단", "방탄"],
    bts_jungkook: ["BTS 정국", "bts jungkook", "jungkook", "정국"],
    bts_v_______: [
      "v",
      "방탄소년단 v",
      "방탄소년단 뷔",
      "뷔",
      "방탄 v",
      "방탄 뷔",
    ],
    nct_________: ["nct", "엔시티"],
    nct_u_______: ["엔시티 유", "nct u"],
    seventeen___: ["세븐틴", "seventeen", "SVT"],
  };

  const isBTS = requestedSongs.data.some((song) =>
    singers.bts_________.some(
      (Singer) => strProcess(song.singer) === strProcess(Singer)
    )
  );
  const isBTSjungKook = requestedSongs.data.some((song) =>
    singers.bts_jungkook.some(
      (Singer) => strProcess(song.singer) === strProcess(Singer)
    )
  );
  const isBTSV = requestedSongs.data.some((song) =>
    singers.bts_v_______.some(
      (Singer) => strProcess(song.singer) === strProcess(Singer)
    )
  );
  const isNct = requestedSongs.data.some((song) =>
    singers.nct_________.some(
      (Singer) => strProcess(song.singer) === strProcess(Singer)
    )
  );
  const isNCTU = requestedSongs.data.some((song) =>
    singers.nct_u_______.some(
      (Singer) => strProcess(song.singer) === strProcess(Singer)
    )
  );
  const isSVT = requestedSongs.data.some((song) =>
    singers.seventeen___.some(
      (Singer) => strProcess(song.singer) === strProcess(Singer)
    )
  );

  let ISbts_________ =
    singers.bts_________.some(
      (Singer) => strProcess(Singer) === strProcess(singer)
    ) && isBTS;
  let ISbts_jungkook =
    singers.bts_jungkook.some(
      (Singer) => strProcess(Singer) === strProcess(singer)
    ) && isBTSjungKook;
  let ISbts_v_______ =
    singers.bts_v_______.some(
      (Singer) => strProcess(Singer) === strProcess(singer)
    ) && isBTSV;
  let ISnct_________ =
    singers.nct_________.some(
      (Singer) => strProcess(Singer) === strProcess(singer)
    ) && isNct;
  let ISnct_u_______ =
    singers.nct_u_______.some(
      (Singer) => strProcess(Singer) === strProcess(singer)
    ) && isNCTU;
  let ISsvt_________ =
    singers.seventeen___.some(
      (Singer) => strProcess(Singer) === strProcess(singer)
    ) && isSVT;

  if (
    requestedSongs.data.some(
      (song) => strProcess(song.singer) === strProcess(singer)
    ) ||
    ISbts_________ ||
    ISbts_jungkook ||
    ISbts_v_______ ||
    ISnct_________ ||
    ISnct_u_______ ||
    ISsvt_________
  ) {
    return "동일한 가수의 신청곡이 존재합니다.";
  }

  // Check if the same song is already requested
  if (
    requestedSongs.data.some(
      (song) => song.songTitle.toUpperCase() === songTitle.toUpperCase()
    )
  ) {
    return "동일한 신청곡이 존재합니다.";
  }

  // Check if the name or student number is in the blacklist
  if (
    blacklist.some(
      (item) => item.name === name || item.studentNumber === studentNumber
    )
  ) {
    return "블랙리스트에 등록되신 것 같습니다. 최근 신청 시 주의사항을 위반한 적이 있는지 확인해주세요";
  }

  // Check if the same person has already made a request
  if (
    requestedSongs.data.some(
      (song) => song.name === name && song.studentNumber === studentNumber
    )
  ) {
    return "이미 신청하셨습니다.";
  }

  return ""; // Request is valid
}

async function main() {
  try {
    await app.prepare();

    const handle = app.getRequestHandler();
    const server = express();

    server.use(express.json());
    server.use(express.static(__dirname + "/public"));

    // Pages
    server
      .get("/", (req, res) => {
        const { query } = parse(req.url, true);
        app.render(req, res, "/", query);
      })
      .get("/song-request", (req, res) => {
        const { query } = parse(req.url, true);
        app.render(req, res, "/song-request", query);
      })
      .get("/suggestion-request", (req, res) => {
        const { query } = parse(req.url, true);
        app.render(req, res, "/suggestion-request", query);
      })
      .get("/morning-song-request", (req, res) => {
        const { query } = parse(req.url, true);
        app.render(req, res, "/morning-song-request", query);
      })
      .get(/_next\/.+/, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      });

    // API Endpoints
    server
      .get("/api/song-request", async (req, res) => {
        res.status(200).json(await getSongFirestore());
      })
      .post("/api/song-request", async (req, res) => {
        const { name, studentNumber, songTitle, singer } = req.body;

        const currentDateString = new Date()
          .toLocaleString("en-US", {
            timeZone: "Asia/Seoul",
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })
          .split(", ")
          .join("-")
          .split(" ")
          .join("");

        let newData = { data: [] };
        let blacklist = [];
        let isValidObj = {};
        const songRequestRef = await getDocs(collection(db, "song-request"));
        songRequestRef.forEach((doc) => {
          if (doc.id == "blacklist") {
            blacklist = doc.data().data;
          } else if (doc.id === "isValid") {
            isValidObj = doc.data();
          } else if (doc.id == currentDateString) {
            newData["data"] = doc.data().data;
          }
        });

        const requestValidity = isRequestValid(
          name,
          studentNumber,
          songTitle,
          singer,
          newData,
          blacklist,
          isValidObj
        );

        if (requestValidity) {
          res.status(400).json({ status: "error", message: requestValidity });
        } else {
          newData.data.push({
            name: name,
            studentNumber: studentNumber,
            songTitle: songTitle,
            singer: singer,
            time: new Date().toLocaleTimeString("en-US", {
              timeZone: "Asia/Seoul",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            }),
          });

          const docRef = doc(db, "song-request", currentDateString);
          await setDoc(docRef, newData);

          console.log(`pushed to ${currentDateString}, data: `);
          console.log(req.body);

          res.status(200).json({
            status: "success",
            message: "노래가 성공적으로 신청되었습니다!",
          });
        }
      })
      .get("/api/suggestion-request", async (req, res) => {
        res.status(200).json(await getSuggestionFirestore());
      })
      .post("/api/suggestion-request", async (req, res) => {
        const { name, studentNumber, suggestion } = req.body;

        let suggestion_blacklist = [];
        const suggestionRequestRef = await getDocs(
          collection(db, "suggestion-request")
        );

        let newData = { data: [] };
        suggestionRequestRef.forEach((doc) => {
          if (doc.id == "requests") {
            newData["data"] = doc.data().data;
          }
        });

        suggestionRequestRef.forEach((doc) => {
          if (doc.id == "blacklist") {
            suggestion_blacklist = doc.data().data;
          }
        });

        if (
          suggestion_blacklist.some(
            (item) => item.name === name || item.studentNumber === studentNumber
          )
        ) {
          res.status(400).json({
            status: "error",
            message: "블랙리스트에 등록되신 것 같습니다.",
          });
        } else {
          // Add the requested song to the array for the current date
          const docRef = doc(db, "suggestion-request", "requests");
          newData.data.push({
            name: name,
            studentNumber: studentNumber,
            suggestion: suggestion,
            answer: "",
          });
          await setDoc(docRef, newData);
          res.status(200).json({
            status: "success",
            message: "방송부 건의사항이 성공적으로 신청되었습니다!",
          });
        }
      })
      .get("/api/morning-song-request", async (req, res) => {
        res.status(200).json(await getMorningSongFirestore());
      })
      .post("/api/morning-song-request", async (req, res) => {
        const { name, studentNumber, songTitle, singer } = req.body;
        const currentDateString = new Date()
          .toLocaleString("en-US", {
            timeZone: "Asia/Seoul",
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })
          .split(", ")
          .join("-")
          .split(" ")
          .join("");

        let newData = { data: [] };
        let blacklist = [];
        let isValidObj = {};
        const songRequestRef = await getDocs(
          collection(db, "morning-song-request")
        );
        songRequestRef.forEach((doc) => {
          if (doc.id == "blacklist") {
            blacklist = doc.data().data;
          } else if (doc.id === "isValid") {
            isValidObj = doc.data();
          } else if (doc.id == currentDateString) {
            newData["data"] = doc.data().data;
          }
        });

        const requestValidity = isRequestValid(
          name,
          studentNumber,
          songTitle,
          singer,
          newData,
          blacklist,
          isValidObj
        );

        const today = new Date();
        const isMorning = today.getHours() < 9 && today.getMinutes() < 30;
        // const isMorning = true;

        if (requestValidity !== "") {
          res.status(400).json({ status: "error", message: requestValidity });
        } else if (isMorning) {
          res
            .status(400)
            .json({ status: "error", message: "신청 가능한 시간이 아닙니다." });
        } else {
          newData.data.push({
            name: name,
            studentNumber: studentNumber,
            songTitle: songTitle,
            singer: singer,
            time: new Date().toLocaleTimeString("en-US", {
              timeZone: "Asia/Seoul",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            }),
          });

          const docRef = doc(db, "morning-song-request", currentDateString);
          await setDoc(docRef, newData);

          console.log(`pushed to ${currentDateString}, data: `);
          console.log(ReqestedJSON);

          res.status(200).json({
            status: "success",
            message: "노래가 성공적으로 신청되었습니다!",
          });
        }
      });

    server.listen(PORT, () => {
      console.log(
        `Server is running on:\n- http://localhost:${PORT}/\n- http://127.0.0.1:${PORT}/`
      );
    });
  } catch (err) {
    console.log(err.stack);
  }
}

main();
