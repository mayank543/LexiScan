import { NextResponse } from "next/server";
import fs from "fs";
import pdf from "pdf-parse";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent";
/**
 * Extracts text from a PDF file.
 */
const extractTextFromPDF = async (filePath: string): Promise<string> => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "";
  }
};

/**
 * Processes text with Gemini API.
 */
const processTextWithGemini = async (text: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is missing. Check your .env file.");
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";
  } catch (error) {
    console.error("Error processing text with Gemini API:", error);
    throw error; // Re-throw to see the complete error in your logs
  }
};

/**
 * API Endpoint for Processing Text
 */
export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "No file URL provided" }, { status: 400 });
    }

    console.log("Downloading file from Cloudinary:", url);

    const response = await axios.get(url, { responseType: "arraybuffer" });
    const filePath = "/tmp/uploaded.pdf"; // Temporary storage
    fs.writeFileSync(filePath, response.data);

    const extractedText = await extractTextFromPDF(filePath);
    if (!extractedText.trim()) {
      return NextResponse.json({ error: "No text extracted from PDF" }, { status: 400 });
    }

    const processedText = await processTextWithGemini(extractedText);
    return NextResponse.json({ text: processedText });
  } catch (error) {
    console.error("Error in processing:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}