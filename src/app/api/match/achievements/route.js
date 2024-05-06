import { matchOnAchievements } from "/backend/data/steam";
import { NextResponse } from "next/server";
import validation from "/backend/helpers.js"

export async function POST(req) {
  let reqBody = null;
  try {
    reqBody = await req.json();
    console.log(reqBody);

    if (!reqBody || Object.keys(reqBody).length === 0) {
      return NextResponse.json(
        {error: 'There are no fields in the request body'},
        {status: 400}
      );
    }
    let email = undefined;
    let gameName = undefined;
    let matchType = undefined;
    try {
      email = validation.emailValidation(reqBody.email);
      gameName = validation.stringCheck(reqBody.gameName);
      matchType = reqBody.matchType;
      validation.matchType(reqBody.matchType);
    } catch (e) {
      console.error(e);
      return NextResponse.json(
        {error: 'Incorrect parameter format'},
        {status: 403}
      );
    }
    console.log(matchType);

    let result = undefined;
    console.log("howdy")
    try {
      console.log("oops")
      result = await matchOnAchievements(email, gameName, matchType);
      console.log(result);
      console.log("ok")
      return NextResponse.json({status: 200})
    } catch (e) {
      console.log("we messed up")
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