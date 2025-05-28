const { default: connectDB } = require("@/config/db");
const { default: User } = require("@/models/User");
const { getAuth } = require("@clerk/nextjs/server");
const { NextResponse } = require("next/server");

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred while fetching user data",
    });
  }
}

//Read up Axios and how to use it in Next.js
