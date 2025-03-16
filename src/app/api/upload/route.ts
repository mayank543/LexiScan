import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Convert Blob to Buffer (for further processing)
    const buffer = Buffer.from(await file.arrayBuffer());

    // TODO: Save buffer to storage / process it with AI
    console.log("Received file:", file.name, "Size:", buffer.length);

    return NextResponse.json({ message: "File uploaded successfully" });
  } catch (error) {
    return NextResponse.json({ message: "File upload failed" }, { status: 500 });
  }
}