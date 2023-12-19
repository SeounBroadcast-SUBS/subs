import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

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

const getSuggestionFirestore = async () => {
  const suggestion = { data: [] };
  const suggestionRef = await getDocs(collection(db, "suggestion-request"));
  suggestionRef.forEach((doc) => {
    if (doc.id === "requests") {
      suggestion["data"] = doc.data().data;
    }
  });

  return suggestion;
};

export async function POST(req) {
  const ReqestedJSON = await req.json();
  const { name, studentNumber, suggestion } = ReqestedJSON;

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
    return NextResponse.json(
      { status: "error", message: "블랙리스트에 등록되신 것 같습니다." },
      { status: 400 }
    );
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
    return NextResponse.json(
      {
        status: "success",
        message: "방송부 건의사항이 성공적으로 신청되었습니다!",
      },
      { status: 200 }
    );
  }
}

export async function GET() {
  return NextResponse.json(await getSuggestionFirestore(), { status: 200 });
}
