// blobStorage.js (converted from TS to JS - ESM)
import ExcelJS from "exceljs";
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
import { Buffer } from "buffer";

dotenv.config();

const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!connStr) throw new Error("Missing AZURE_STORAGE_CONNECTION_STRING");

const containerName = process.env.AZURE_BLOB_CONTAINER || "tinitiate-projects";

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const containerClient = blobServiceClient.getContainerClient(containerName);

const USERS_XLSX = "users.xlsx";   // new users only
const LOGINS_XLSX = "logins.xlsx"; // every login

export async function recordUserLogin(input) {
  console.log("recordUserLogin:", input);
  await containerClient.createIfNotExists();

  const now = new Date();
  const ts = now.toISOString(); // reliable timestamp

  // 1) Upsert into Users workbook (only if new email)
  const isNewUser = await upsertUserRow({
    blobName: USERS_XLSX,
    sheetName: "Users",
    header: ["Name", "Email", "FirstSeenAt","GeoLocation"],
    uniqueEmail: input.email,
    row: [input.name, input.email, ts, input.location?.ipGeo || null],
  });

  // 2) Always append into Logins workbook
  await appendRow({
    blobName: LOGINS_XLSX,
    sheetName: "Logins",
    header: ["Email", "Name", "LoggedInAt","GeoLocation"],
    row: [input.email, input.name, ts, input.location?.ipGeo || null],
  });

  return { isNewUser };
}

async function upsertUserRow(opts) {
  const blockBlobClient = containerClient.getBlockBlobClient(opts.blobName);

  const wb = await loadWorkbookIfExists(blockBlobClient);
  const ws = ensureSheetWithHeader(wb, opts.sheetName, opts.header);

  const emailColIndex = opts.header.indexOf("Email") + 1; // 1-based
  const lastRow = ws.rowCount;

  for (let r = 2; r <= lastRow; r++) {
    const cellVal = String(ws.getRow(r).getCell(emailColIndex).value ?? "")
      .trim()
      .toLowerCase();

    if (cellVal === opts.uniqueEmail.trim().toLowerCase()) {
      // already exists
      await uploadWorkbook(blockBlobClient, wb);
      return false;
    }
  }

  ws.addRow(opts.row);
  await uploadWorkbook(blockBlobClient, wb);
  return true;
}

async function appendRow(opts) {
  const blockBlobClient = containerClient.getBlockBlobClient(opts.blobName);

  const wb = await loadWorkbookIfExists(blockBlobClient);
  const ws = ensureSheetWithHeader(wb, opts.sheetName, opts.header);

  ws.addRow(opts.row);

  await uploadWorkbook(blockBlobClient, wb);
}

function ensureSheetWithHeader(workbook, sheetName, header) {
  let ws = workbook.getWorksheet(sheetName);
  if (!ws) ws = workbook.addWorksheet(sheetName);

  // If empty, write header row
  if (ws.rowCount === 0) {
    ws.addRow(header);
    ws.getRow(1).font = { bold: true };
  }

  return ws;
}

async function loadWorkbookIfExists(blockBlobClient) {
  const wb = new ExcelJS.Workbook();

  const exists = await blockBlobClient.exists();
  if (!exists) return wb;

  const download = await blockBlobClient.download(0);
  const bytes = await streamToUint8Array(download.readableStreamBody);

  // exceljs likes Buffer in Node
  await wb.xlsx.load(Buffer.from(bytes));

  return wb;
}

async function streamToUint8Array(readable) {
  if (!readable) return new Uint8Array();

  const chunks = [];
  return await new Promise((resolve, reject) => {
    readable.on("data", (d) => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(d)));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
}

async function uploadWorkbook(blockBlobClient, workbook) {
  const out = await workbook.xlsx.writeBuffer();

  const bytes =
    out instanceof ArrayBuffer
      ? new Uint8Array(out)
      : Buffer.isBuffer(out)
        ? out // Buffer is a Uint8Array
        : new Uint8Array(out);

  await blockBlobClient.uploadData(bytes, {
    blobHTTPHeaders: {
      blobContentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}

// (kept, even though unused — same as your TS file)
async function streamToBuffer(readableStream) {
  if (!readableStream) return Buffer.from("");

  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (d) => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(d)));
    readableStream.on("end", () => resolve(Buffer.concat(chunks)));
    readableStream.on("error", reject);
  });
}
