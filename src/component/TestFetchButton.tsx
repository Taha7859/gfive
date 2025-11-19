"use client";

import { useState } from "react";

export default function TestFetchButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFetch = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/product/fetch");
      const data = await res.json();

      if (res.ok) {
        console.log("MongoDB insert result:", data);
        setMessage(`✅ ${data.count} products saved successfully! Check console for details.`);
      } else {
        console.error("Error response:", data);
        setMessage(`❌ Failed: ${data.error || data.message}`);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("❌ Fetch failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleFetch}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Fetching..." : "Fetch & Save Products"}
      </button>

      {message && (
        <p className="mt-2 text-sm text-gray-800">{message}</p>
      )}
    </div>
  );
}
