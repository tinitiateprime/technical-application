// src/utils/usageLogger.ts
import { appendCsvLine } from "./blobCsv";

const API_USAGE_BLOB = "api_usage.csv";

export type UsagePayload = {
  userId: string;
  email: string;
  applicationId: string;
  model: string;
  tokensPrompt: number;
  tokensCompletion: number;
  tokensTotal: number;
  costUsd: number;
  calledAt?: string;
};

export async function recordApiUsage(payload: UsagePayload) {
  const {
    userId,
    email,
    applicationId,
    model,
    tokensPrompt,
    tokensCompletion,
    tokensTotal,
    costUsd,
  } = payload;

  const calledAt = payload.calledAt || new Date().toISOString();

  await appendCsvLine(
    API_USAGE_BLOB,
    [
      "user_id",
      "email",
      "application_id",
      "model",
      "tokens_prompt",
      "tokens_completion",
      "tokens_total",
      "cost_usd",
      "called_at",
    ],
    [
      userId,
      email,
      applicationId,
      model,
      tokensPrompt,
      tokensCompletion,
      tokensTotal,
      costUsd,
      calledAt,
    ]
  );

  return { ok: true };
}
