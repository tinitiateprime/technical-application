"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function TopicPage() {
  const router = useRouter();
  const { subject, topic } = router.query;

  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const cacheKey = `md-cache-${subject}`;

  useEffect(() => {
    if (!subject || !topic) return;

    const cachedSubject = localStorage.getItem(cacheKey);
    if (cachedSubject) {
      const parsed = JSON.parse(cachedSubject);
      if (parsed[topic as string]) {
        setContent(parsed[topic as string]);
        return;
      }
    }

    setError("Topic not found in cache. Please open the subject page first.");
  }, [subject, topic]);

  if (error)
    return <p style={{ color: "red", padding: 20 }}>{error}</p>;

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "auto" }}>
      <h1>{topic}</h1>
      {content ? <ReactMarkdown>{content}</ReactMarkdown> : "Loading..."}
    </div>
  );
}
