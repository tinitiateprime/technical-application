"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Topics {
  [key: string]: string; // topic name -> markdown content (cached)
}

export default function SubjectPage() {
  const router = useRouter();
  const { subject } = router.query;

  const [topics, setTopics] = useState<Topics>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cacheKey = `md-cache-${subject}`;

  useEffect(() => {
    if (!subject) return;

    // 1️⃣ Check if subject is already cached
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setTopics(JSON.parse(cached));
      setLoading(false);
      return;
    }

    // 2️⃣ Fetch data.json → then fetch all markdown for this subject
    fetch("/git/data.json")
      .then(res => res.json())
      .then(async data => {
        const subj = data.subjects[subject as string];
        if (!subj) throw new Error("Subject not found");

        const fetchedTopics: Topics = {};

        for (const [topicName, url] of Object.entries(subj)) {
          try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const md = await res.text();
            fetchedTopics[topicName] = md;
          } catch (err) {
            console.error("Failed to fetch topic:", topicName, err);
          }
        }

        // Cache all topics
        localStorage.setItem(cacheKey, JSON.stringify(fetchedTopics));
        setTopics(fetchedTopics);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [subject]);

  if (loading) return <p style={{ padding: 20 }}>Loading topics...</p>;
  if (error) return <p style={{ color: "red", padding: 20 }}>{error}</p>;

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "auto" }}>
      <h1>{subject}</h1>
      {Object.keys(topics).length ? (
        <ul>
          {Object.keys(topics).map(topic => (
            <li key={topic}>
              <a href={`/topic/${encodeURIComponent(topic)}?subject=${encodeURIComponent(subject)}`}>
                {topic}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No topics found for this subject.</p>
      )}
    </div>
  );
}
