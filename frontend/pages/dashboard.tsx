"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return <p>Please sign in first.</p>;

  const repos = [
    { name: "Vue.js", slug: "vuejs" },
    { name: "Next.js", slug: "nextjs" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f0f2f5",
        padding: "20px",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ color: "#0070f3", fontWeight: 600, fontSize: 24 }}>
          Tinitiate Dashboard
        </h1>
        <button
          onClick={() => signOut()}
          style={{
            padding: "8px 18px",
            backgroundColor: "#e53935",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Sign Out
        </button>
      </header>

      {/* User Avatar (name & email hidden, session safe) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px 40px",
          marginTop: 20,
          backgroundColor: "#fff",
          borderRadius: 10,
          maxWidth: 700,
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <img
          src={session.user?.image || ""}
          alt="User Avatar"
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Tutorials */}
      <section
        style={{
          maxWidth: 900,
          margin: "40px auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        {repos.map((repo) => (
          <div
            key={repo.slug}
            onClick={() => router.push(`/subject/${repo.slug}`)}
            style={{
              padding: 25,
              backgroundColor: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateY(-5px)";
              el.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
            }}
          >
            <h3 style={{ margin: 0, color: "#0070f3", fontSize: 18 }}>
              {repo.name}
            </h3>
            <p style={{ marginTop: 6, fontSize: 14, color: "#5f6368" }}>
              Click to view tutorial
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
