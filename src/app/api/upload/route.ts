import { NextResponse } from "next/server";
import { v2 as cloudinary }  from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64File, {
      folder: "uploads", // Change folder name as needed
    });

    return NextResponse.json({ message: "File uploaded successfully", url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Upload failed", error: (error as Error).message }, { status: 500 });
  }
}
