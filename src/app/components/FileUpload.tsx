"use client";

import { useState } from  "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");   
  const [fileUrl, setFileUrl] = useState<string | null>(null); // Store Cloudinary URL
  const [pdfText, setPdfText] = useState<string | null>(null); // Store extracted text

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
      setFileUrl(null);
      setPdfText(null); // Reset extracted text
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || "File uploaded successfully!");

      if (data.url) {
        setFileUrl(data.url); // Store file URL
        await handleExtractText(data.url); // Extract text after upload
      }
    } catch (error) {
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleExtractText = async (fileUrl: string) => {
  try {
    const res = await fetch("/api/process", {
      method: "POST",
      body: JSON.stringify({ url: fileUrl }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log("📝 Extracted Text Response:", data); // Debugging

    if (data.text) {
      setPdfText(data.text); // Store extracted text
      setMessage("Text extracted successfully!");
    } else {
      setMessage("Failed to extract text.");
    }
  } catch (error) {
    console.error("❌ Extraction error:", error);
    setMessage("Error extracting text.");
  }
};

  return (
    <div className="p-4 border rounded-md">
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-primary text-secondary rounded-md"
      >
        {uploading ? "Uploading..." : "Upload & Extract Text"}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
      {fileUrl && (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-500">
          View Uploaded File
        </a>
      )}
      {pdfText && (
        <div className="mt-4 p-2 bg-gray-100 border rounded-md">
          <h3 className="font-semibold">Extracted Text:</h3>
          <p className="text-sm overflow-y-auto max-h-40">{pdfText}</p>
        </div>
      )}
    </div>
  );
}
