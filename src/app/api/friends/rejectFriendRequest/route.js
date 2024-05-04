import {isFriendOrPending, rejectFriendRequest} from "/backend/data/friends";
import { NextResponse } from "next/server";

export async function POST(req) {
  let reqBody = null;
  try {
    reqBody = await req.json();
    console.log(reqBody);
    const sender = reqBody.sender;
    const recipient = reqBody.recipient;

    if (!reqBody || Object.keys(reqBody).length === 0) {
      return NextResponse.json(
        {error: 'There are no fields in the request body'},
        {status: 400}
      );
    }
    let result = undefined;
    try {
      result = await rejectFriendRequest(recipient, sender);
      console.log("ok")
      return NextResponse.json({status: 200})
    } catch (e) {
      console.error(e);
      return NextResponse.json({error: e}, {status: 500});

    }

  } catch (e) {
    return NextResponse.json(
      {error: 'There is no request body'},
      {status: 400}
    );
  }
}