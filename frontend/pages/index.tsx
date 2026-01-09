"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SignInButton from "./components/SignInButton";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/dashboard");
    return <p>Redirecting...</p>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
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
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/favicon_new.png"
            alt="Tinitiate Logo"
            style={{ height: 40, marginRight: 10 }}
          />
          <span style={{ fontSize: 20, fontWeight: 500, color: "#202124" }}>
            Tinitiate
          </span>
        </div>

        {/* Sign in */}
        <SignInButton />
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 500 }}>
          <h1
            style={{
              fontSize: "36px",
              color: "#202124",
              marginBottom: "20px",
              fontWeight: 500,
            }}
          >
            Welcome to Tinitiate
          </h1>
          <p style={{ fontSize: "16px", color: "#5f6368", marginBottom: 30 }}>
            Sign in with Google to continue and access tutorials
          </p>
          <SignInButton />
        </div>
      </main>
    </div>
  );
}
