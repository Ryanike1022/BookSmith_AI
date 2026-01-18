"use client";

import { useEffect, useState } from "react";

export default function ApiTestPage() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/docs")
      .then((r) => {
        if (!r.ok) throw new Error("Backend not reachable");
        return r.text();
      })
      .then(() => setStatus("✅ Backend reachable"))
      .catch((e) => setStatus("❌ Error: " + String(e)));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>API TEST PAGE ✅</h1>
      <p>{status}</p>
    </div>
  );
}
