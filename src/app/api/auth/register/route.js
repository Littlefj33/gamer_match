import { userData } from "../../../../../backend/data/index.js";
import { NextResponse } from "next/server";

export async function POST(req) {
    let reqBody = null;
    try {
        reqBody = await req.json();
        if (!reqBody || Object.keys(reqBody).length === 0) {
            return NextResponse.json(
                { error: "There are no fields in the request body" },
                { status: 400 }
            );
        }
        try {
            const newUser = await userData.registerUser(
                reqBody.displayName,
                reqBody.email,
                reqBody.password
            );
            return NextResponse.json(newUser, { status: 200 });
        } catch (e) {
            return NextResponse.json({ error: e }, { status: 500 });
        }
    } catch (e) {
        return NextResponse.json(
            { error: "There is no request body" },
            { status: 400 }
        );
    }
}
