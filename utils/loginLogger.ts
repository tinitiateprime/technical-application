// src/utils/loginLogger.ts
import { appendCsvLine, csvHasRow } from "./blobCsv";

const UNIQUE_LOGINS_BLOB = "unique_logins.csv";
const RECURRING_LOGINS_BLOB = "recurring_logins.csv";

export type LoginPayload = {
  userId: string;          // internal user id
  email: string;
  name?: string;
  applicationId: string;   // which of your apps
  ip?: string | null;
  ipGeo?: {
    country: string | null;
    city: string | null;
  };
  loggedInAt?: string;     // ISO time, default now
};

export async function recordUserLogin(payload: LoginPayload) {
  const {
    userId,
    email,
    applicationId,
    ip,
    ipGeo,
  } = payload;
  const loggedInAt = payload.loggedInAt || new Date().toISOString();

  console.log(`Recording login for user ${userId} (${email}) on app ${applicationId} at ${loggedInAt}, ip ${ip}, geo ${ipGeo?.country}/${ipGeo?.city}`);

  // 1) ensure unique record (user+app) in unique_logins.csv
  const alreadyExists = await csvHasRow(UNIQUE_LOGINS_BLOB, (cols) => {
    const [cUserId, cEmail, , cAppId] = cols;
    return cUserId === userId && cAppId === applicationId;
  });

  if (!alreadyExists) {
    await appendCsvLine(
      UNIQUE_LOGINS_BLOB,
      ["user_id", "email", "first_login_at", "application_id"],
      [userId, email, loggedInAt, applicationId]
    );
  }

  // 2) always write to recurring_logins.csv
  await appendCsvLine(
    RECURRING_LOGINS_BLOB,
    ["user_id", "email", "login_at", "application_id", "ip", "country", "city"],
    [
      userId,
      email,
      loggedInAt,
      applicationId,
      ip || "",
      ipGeo?.country || "",
      ipGeo?.city || "",
    ]
  );

  return { ok: true, firstTime: !alreadyExists };
}
