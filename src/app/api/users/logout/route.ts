import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: "Logout Successfully",
      success: true,
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: Date.now(),
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
