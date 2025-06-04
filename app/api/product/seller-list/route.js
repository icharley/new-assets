import connectDB from "@/config/db";
import Product from "@/models/Product"; // Import the Product model to interact with the product data
import { getAuth } from "@clerk/nextjs/server"; // Import getAuth to access authentication methods
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request); // Get the authenticated user's ID
    const userLoggedIn = userId;

    if (!userLoggedIn) {
      return NextResponse.json(
        {
          success: false,
          message: "Kindly Log in to view your products",
        },
        { status: 401 }
      );
    }
    await connectDB(); // Connect to the database

    const products = await Product.find({});
    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
