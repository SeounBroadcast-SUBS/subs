import connectMongoDB from "@/lib/monodb";
import SuggestionRequest from "@/models/SuggestionRequest";
import { NextResponse } from "next/server";

export async function POST(req) {
  const ReqestedJSON = await req.json();
  console.log(ReqestedJSON);
  const { name, studentNumber, suggestion } = ReqestedJSON;

  await connectMongoDB();
  const blacklist = await SuggestionRequest.findById(
    "659044a7bccbf9ea338d017c"
  );
  if (blacklist.requests.some((d) => d.studentNumber === studentNumber)) {
    return NextResponse.json(
      {
        message:
          "블랙리스트에 등록되신 것 같습니다. 최근 신청 시 주의사항을 위반한 적이 있는지 확인해주세요",
      },
      { status: 500 }
    );
  } else {
    await SuggestionRequest.findByIdAndUpdate(
      "659044a7bccbf9ea338d017c",
      {
        $push: {
          requests: {
            name: name,
            studentNumber: studentNumber,
            suggestion: suggestion,
            answer: "",
          },
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(
      { message: "건의사항이 성공적으로 신청되었습니다." },
      { status: 201 }
    );
  }
}

export async function GET() {
  await connectMongoDB();
  const requests = await SuggestionRequest.findById("659044a7bccbf9ea338d017c");

  return NextResponse.json(requests.requests, { status: 200 });
}
