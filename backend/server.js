import express from "express";
import dotenv from "dotenv";
import cors from "cors";
//import authRoutes from "./routes/authRoutes.js";
import { recordUserLogin } from "./utils/blobStorage.js";

dotenv.config();

const app = express();

// ⚠️ Change this so you don't collide with AirTunes/AirPlay using 5000 on your Mac
const port = Number(process.env.PORT || 5050);

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: (origin, cb) => {
      // allow curl/postman (no Origin header)
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

// quick sanity route (use this to verify you're hitting Express)
app.get("/health", (req, res) => res.json({ ok: true }));

/**
 * IMPORTANT:
 * Put /post-login BEFORE app.use('/api/auth', authRoutes)
 * so authRoutes can't intercept it and return 403.
 */
// app.post("/api/auth/post-login", async (req, res) => {
//   try {
//     const { name, email, gps } = req.body ?? {};

//     if (!email || typeof email !== "string") {
//       return res.status(400).json({ ok: false, error: "email is required" });
//     }


//     console.log("post-login request:", { name, email, gps });
//    // --- Option A: GPS from browser (if provided) ---
//     const gpsSafe =
//       gps &&
//       typeof gps === "object" &&
//       Number.isFinite(gps.lat) &&
//       Number.isFinite(gps.lon)
//         ? {
//             lat: Number(gps.lat),
//             lon: Number(gps.lon),
//             accuracy: Number.isFinite(gps.accuracy) ? Number(gps.accuracy) : null,
//           }
//         : null;

//     // --- Option B: IP + edge/provider geo headers (no permission prompt) ---
//     const forwardedFor = req.headers["x-forwarded-for"];
//     const ip =
//       (typeof forwardedFor === "string" ? forwardedFor.split(",")[0].trim() : null) ||
//       req.socket?.remoteAddress ||
//       null;

//     // Works on Vercel / some proxies; harmless elsewhere (nulls)
//     const ipGeo = {
//       country: req.headers["x-vercel-ip-country"] || req.headers["cf-ipcountry"] || null,
//       region: req.headers["x-vercel-ip-country-region"] || null,
//       city: req.headers["x-vercel-ip-city"] || null,
//       postalCode: req.headers["x-vercel-ip-postal-code"] || null,
//       timezone: req.headers["x-vercel-ip-timezone"] || null,
//       latitude: req.headers["x-vercel-ip-latitude"] || null,
//       longitude: req.headers["x-vercel-ip-longitude"] || null,
//     };

//     const result = await recordUserLogin({
//       name: typeof name === "string" ? name : "",
//       email,
//       location: { ipGeo , ip, gps: gpsSafe },
//     });

//     return res.json({ ok: true, ...result });
//   } catch (err) {
//     console.error("post-login error:", err);
//     return res.status(500).json({ ok: false, error: "server_error" });
//   }
// });

//app.use("/api/auth", authRoutes);


app.post("/api/auth/post-login", async (req, res) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip =
    (typeof forwardedFor === "string" ? forwardedFor.split(",")[0].trim() : null) ||
    req.socket?.remoteAddress ||
    null;

  const ipGeo = {
    country: req.headers["x-vercel-ip-country"] || req.headers["cf-ipcountry"] || null,
    region: req.headers["x-vercel-ip-country-region"] || null,
    city: req.headers["x-vercel-ip-city"] || null,
    postalCode: req.headers["x-vercel-ip-postal-code"] || null,
    timezone: req.headers["x-vercel-ip-timezone"] || null,
    latitude: req.headers["x-vercel-ip-latitude"] || null,
    longitude: req.headers["x-vercel-ip-longitude"] || null,
  };

    console.log("DEBUG ip:", ip);
  console.log("DEBUG ipGeo:", ipGeo);

  try {
     const result = await recordUserLogin({
      name: typeof name === "string" ? name : "",
      email,
      location: { ipGeo , ip, gps: gpsSafe },
    });

    return res.json({ ok: true, ...result });
  } catch (err) {
    console.error("post-login error:", err);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
     
});


app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
