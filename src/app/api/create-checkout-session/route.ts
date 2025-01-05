import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount, language } = await request.json();

    // ensure the amount is in cents and is a valid number
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Invalid amount");
    }

    const baseUrl = process.env.BASE_URL;

    return NextResponse.json({ sessionId: "no-session" });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
