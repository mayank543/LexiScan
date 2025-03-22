"use client"; // 👈 Important for using useState

import React from "react";

const Sidebar = ({ onSelect }: { onSelect: (action: string) => void }) => {
  return (
    <div className="w-1/4 min-h-screen bg-primary text-secondary p-6">
      <h2 className="text-lg font-bold mb-4">LexiScan - Your Legal Assistant</h2>
      <p className="text-sm mb-6">
        This app is an LLM-powered chatbot using Mistral - Langchain - Streamlit
      </p>
      <div className="flex flex-col space-y-3">
        <button
          className="bg-secondary hover:bg-gray-600 p-2 rounded text-primary"
          onClick={() => onSelect("summarize")}
        >
          Summarize
        </button>
        <button
          className="bg-secondary hover:bg-gray-600 p-2 rounded text-primary"
          onClick={() => onSelect("extract-clauses")}
        >
          Extract Clauses
        </button>
        <button
          className="bg-secondary hover:bg-gray-600 p-2 rounded text-primary"
          onClick={() => onSelect("extract-entities")}
        >
          Extract Entities
        </button>
      </div>
    </div>
  );
};

export default Sidebar;