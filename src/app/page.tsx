"use client";
import Sidebar from "@/app/components/Sidebar"; // ✅ Explicitly include `app`
import FileUpload from "@/app/components/FileUpload"; // ✅ Ensure correct import
import { useState } from "react";

export default function HomePage() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleActionSelect = (action: string) => {
    console.log("Selected action:", action);
    setSelectedAction(action);
  };

  return (
    <div className="flex">
      {/* Sidebar with onSelect function */}
      <Sidebar onSelect={handleActionSelect} />

      <div className="flex-1 p-6 bg-secondary">
        <h1 className="text-2xl text-primary font-bold ">Legal Document Analyzer</h1>

        {/* Show selected action */}
        {selectedAction && <p className="mt-4">Action selected: {selectedAction}</p>}

        {/* ✅ Add FileUpload component here */}
        <div className="mt-6">
          <h2 className="text-xl  text-primary font-semibold mb-2">Upload Your Document</h2>
          <FileUpload />
        </div>
      </div>
    </div>
  );
}