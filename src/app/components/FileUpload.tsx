"use client";

import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);  // to tell ui if file inserted or not accrodingly change ui
  const [message, setMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);   //here we have to retain the input type as file
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
    } catch (error) {
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <input type="file" onChange={handleFileChange}  />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-primary text-secondary rounded-md"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}

