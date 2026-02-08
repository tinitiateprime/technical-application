// src/server.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { recordUserLogin } from "./app/src/utils/loginLogger";
import { recordApiUsage } from "./app/src/utils/usageLogger";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5050);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (origin === FRONTEND_ORIGIN) return cb(null, true);
      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

// 1) login endpoint – called by your main app after auth success
app.post("/api/auth/post-login", async (req, res) => {
  try {
    const { userId, email, name, applicationId } = req.body ?? {};
    if (!userId || !email || !applicationId) {
      return res.status(400).json({ ok: false, error: "missing_fields" });
    }

    const forwardedFor = req.headers["x-forwarded-for"];
    const ip =
      (typeof forwardedFor === "string"
        ? forwardedFor.split(",")[0].trim()
        : null) || req.socket?.remoteAddress || null;

    const ipGeo = {
      country:
        (req.headers["x-vercel-ip-country"] as string) ||
        (req.headers["cf-ipcountry"] as string) ||
        null,
      city: (req.headers["x-vercel-ip-city"] as string) || null,
    };

    const result = await recordUserLogin({
      userId,
      email,
      name,
      applicationId,
      ip,
      ipGeo,
    });

    const { ok: _ok, ...safeResult } = result ?? {};
    return res.json({ ok: true, ...safeResult });
  } catch (err) {
    console.error("post-login error:", err);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

// 2) usage endpoint – call this after each API call in your main app
app.post("/api/usage/record", async (req, res) => {
  try {
    const {
      userId,
      email,
      applicationId,
      model,
      tokensPrompt,
      tokensCompletion,
      tokensTotal,
      costUsd,
    } = req.body ?? {};

    if (!userId || !email || !applicationId || !model || !tokensTotal) {
      return res.status(400).json({ ok: false, error: "missing_fields" });
    }
    const result = await recordApiUsage({
      userId,
      email,
      applicationId,
      model,
      tokensPrompt: Number(tokensPrompt || 0),
      tokensCompletion: Number(tokensCompletion || 0),
      tokensTotal: Number(tokensTotal),
      costUsd: Number(costUsd || 0),
    });

    const { ok: _ok, ...safeResult } = result ?? {};
    return res.json({ ok: true, ...safeResult });
  } catch (err) {
    console.error("usage record error:", err);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

app.listen(port, () => {
  console.log(`✅ Usage backend on http://localhost:${port}`);
});
