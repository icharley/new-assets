import connectDB from "@/config/db";
import Product from "@/models/Product"; // Import the Product model to interact with the product data
import { getAuth } from "@clerk/nextjs/server"; // Import getAuth to access authentication methods
import { v2 as cloudinary } from "cloudinary"; // Import cloudinary for image handling
import { NextResponse } from "next/server"; // Import NextResponse to handle API responses

// configure cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST REQUEST TO CREATE NEW PRODUCT TO OUR DATABASE

export async function POST(request) {
  //try is to catch any errors that may occur during the execution of the code
  try {
    //get user ID
    const { userId } = getAuth(request); // Get the authenticated user's ID
    const userLoggedIn = userId;

    if (!userLoggedIn) {
      return NextResponse.json(
        {
          success: false,
          message: "User not logged in",
        },
        { status: 401 }
      );
    }

    //parse form data from the request
    const formData = await request.formData();

    //Extract product details from form data
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    const category = formData.get("category");

    //get all uploaded images files
    const files = formData.getAll("image"); // Get all uploaded image files from the form data

    //confirm that the images are uploaded
    //before the request is completed
    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No files uploaded",
        },
        { status: 400 }
      );
    }

    // process all images in parallel using Promise.all
    const result = await Promise.all(
      files.map(async (file) => {
        //convert file to buffer for upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        //upload each file to cloudinary using streaming upload

        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result); //
              }
            }
          );
          stream.end(Buffer.from(buffer));
        });
      })
    );

    //extract the secure URLs from Cloudinary response
    const image = result.map((res) => result.secure_url);

    //connect to the database
    await connectDB();
    //create a new product in the database

    const newProduct = await Product.create({
      userId,
      name,
      description,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      image,
      date: Date.now(),
    }); // return success response with the created product data
    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      newProduct,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error adding product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
