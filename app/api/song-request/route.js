import { NextResponse } from "next/server";
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyB2ivn9RLCo_2CvErmyzQNTIdL2cxH9zPM",
  authDomain: "subs-7a132.firebaseapp.com",
  projectId: "subs-7a132",
  storageBucket: "subs-7a132.appspot.com",
  messagingSenderId: "618126276524",
  appId: "1:618126276524:web:da22c1abcdc78ed9d72c09",
  measurementId: "G-9W1YHRTQL6",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const getSongFirestore = async () => {
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
};

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

export async function POST(req) {
  const ReqestedJSON = await req.json();
  const { name, studentNumber, songTitle, singer } = ReqestedJSON;
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

  if (requestValidity !== "") {
    return NextResponse.json(
      { status: "error", message: requestValidity },
      { status: 400 }
    );
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
    console.log(ReqestedJSON);

    return NextResponse.json(
      {
        status: "success",
        message: "노래가 성공적으로 신청되었습니다!",
      },
      { status: 200 }
    );
  }
}

export async function GET() {
  return NextResponse.json(await getSongFirestore(), { status: 200 });
}
