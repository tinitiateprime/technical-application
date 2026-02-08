// src/utils/blobCsv.ts
import { BlobServiceClient } from "@azure/storage-blob";
import { Readable } from "stream";
import * as path from "path";
import * as dotenv from "dotenv";
import process from "process";

dotenv.config();
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!;
if (!connectionString) {
  throw new Error("AZURE_STORAGE_CONNECTION_STRING is not set");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const CONTAINER_NAME = process.env.AZURE_LOG_CONTAINER || "usage-logs";

// helper: ensure container exists (private)
async function getContainer() {
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  // make it private, no public access
  await containerClient.createIfNotExists(); // or { access: "container" | "private" } depending on SDK typing
  return containerClient;
}
// helper: read blob content as string (or empty if missing)
async function readBlobAsString(blobPath: string): Promise<string> {
  const container = await getContainer();
  const blobClient = container.getBlockBlobClient(blobPath);

  const exists = await blobClient.exists();
  if (!exists) return "";

  const download = await blobClient.download();
  const stream = download.readableStreamBody;
  if (!stream) return "";

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (d) => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(d)));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    stream.on("error", reject);
  });
}

// helper: overwrite blob with new string
async function writeBlobFromString(blobPath: string, content: string) {
  const container = await getContainer();
  const blobClient = container.getBlockBlobClient(blobPath);
  const buffer = Buffer.from(content, "utf8");
  await blobClient.uploadData(buffer);
}

// append a CSV line, adding header if file does not exist
export async function appendCsvLine(
  blobPath: string,
  headerColumns: string[],
  row: (string | number | null | undefined)[]
) {
  const headerLine = headerColumns.join(",") + "\n";

  const normalizedRow = row.map((v) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[,\"\n]/.test(s) ? `"${s}"` : s;
  });

  const rowLine = normalizedRow.join(",") + "\n";

  const existing = await readBlobAsString(blobPath);
  if (!existing) {
    await writeBlobFromString(blobPath, headerLine + rowLine);
  } else {
    await writeBlobFromString(blobPath, existing + rowLine);
  }
}

// check if unique record exists (for unique_logins)
export async function csvHasRow(
  blobPath: string,
  matchFn: (cols: string[]) => boolean
): Promise<boolean> {
  const csv = await readBlobAsString(blobPath);
  if (!csv) return false;
  const lines = csv.split("\n").filter((l) => l.trim().length > 0);
  // skip header
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (matchFn(cols)) return true;
  }
  return false;
}
