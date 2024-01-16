import connectMongoDB from "@/lib/monodb";
import MorningSongRequest from "@/models/MorningSongRequest";
import { NextResponse } from "next/server";

function isRequestValid(requests, blacklist, newRequest) {
  const strProcess = (str) =>
    str
      .toUpperCase()
      .replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, "") // replace all special chars to empty char
      .trim()
      .split(" ")
      .join("");

  const { name, studentNumber, songTitle, singer } = newRequest;
  let message = "";

  // Check if it is a weekend in Seoul, Korea
  const today = new Date();
  const dayOfWeek = today.getDay();
  // const isWeekend = false;
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 || today.getHours() < 8; // 0 is Sunday, 6 is Saturday

  // Check if the request limit (10개) is over
  const requestCount = requests.length;
  const isRequestLimitReached = requestCount >= 10;

  // Check if the duplicated song has already been requested
  const isDuplicateSongRequested = requests.some(
    (req) => strProcess(req.songTitle) === strProcess(songTitle)
  );

  // Check if the requester already requested
  const isRequesterAlreadyRequested = requests.some(
    (req) => req.studentNumber === studentNumber
  );

  // Check if the requester is in the blacklist
  const isRequesterBlacklisted = blacklist.some(
    (blacklisted) => blacklisted.studentNumber === studentNumber
  );

  // Check if the duplicated singer has been requested
  const duplicatedSingerNames = [
    ["G-IDLE", "IDLE", "아이들", "여자아이들"],
    ["bts", "방탄소년단", "방탄"],
    ["BTS 정국", "bts jungkook", "jungkook", "정국"],
    ["v", "방탄소년단 v", "방탄소년단 뷔", "뷔", "방탄 v", "방탄 뷔"],
    ["nct", "엔시티"],
    ["엔시티 유", "nct u"],
    ["Seventeen", "세븐틴"],
  ].map((d, i) => d.map(strProcess));

  const isDuplicateSingerRequested = duplicatedSingerNames.some(
    (singerVariations) =>
      requests.some((req) =>
        singerVariations.includes(strProcess(req.singer))
      ) && singerVariations.includes(strProcess(singer))
  );

  // Final validation
  if (isWeekend) {
    message = "신청기간이 아닙니다.";
  } else if (isRequestLimitReached) {
    message = "오늘 신청이 마감되었습니다. (10개)";
  } else if (isDuplicateSongRequested) {
    message = "동일한 신청곡이 존재합니다.";
  } else if (isRequesterAlreadyRequested) {
    message = "이미 신청하셨습니다.";
  } else if (isRequesterBlacklisted) {
    message =
      "블랙리스트에 등록되신 것 같습니다. 최근 신청 시 주의사항을 위반한 적이 있는지 확인해주세요";
  } else if (
    isDuplicateSingerRequested ||
    requests.some((req) => req.singer === singer)
  ) {
    message = "동일한 가수의 신청곡이 존재합니다.";
  }

  const isValid = message === ""; // If error message is empty, request is valid

  return { isValid, message };
}

export async function POST(req) {
  const ReqestedJSON = req.json();
  console.log(ReqestedJSON);
  const { name, studentNumber, songTitle, singer } = ReqestedJSON;

  await connectMongoDB();

  const isValidDoc = JSON.parse(
    JSON.stringify(
      await MorningSongRequest.findById("65945566f2790d57d00ff1fe")
    )
  );
  if (!isValidDoc.isValid) {
    return NextResponse.json({ message: isValidDoc.message }, { status: 500 });
  }

  const currentDate = new Date();
  const v = await MorningSongRequest.findOne({
    date: currentDate.toLocaleDateString(),
  });
  const request = v ? v : { requests: [] };
  const blacklist = await MorningSongRequest.findOne({
    date: "blacklist",
  });
  const requestValidity = isRequestValid(
    request.requests,
    blacklist.requests,
    ReqestedJSON
  );
  if (requestValidity.isValid) {
    await MorningSongRequest.findOneAndUpdate(
      { date: currentDate.toLocaleDateString() },
      {
        $push: {
          requests: {
            name: name,
            studentNumber: studentNumber,
            songTitle: songTitle,
            singer: singer,
            timestamp: new Date(),
          },
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(
      { message: "노래가 성공적으로 신청되었습니다." },
      { status: 201 }
    );
  } else {
    return NextResponse.json(
      { message: requestValidity.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectMongoDB();
  const currentDate = new Date();
  const v = await MorningSongRequest.findOne({
    date: currentDate.toLocaleDateString(),
  });
  const requests = v ? v : { requests: [] };

  return NextResponse.json(requests.requests, { status: 200 });
}
