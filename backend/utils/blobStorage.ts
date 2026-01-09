import { BlobServiceClient } from "@azure/storage-blob";
import { format } from "date-fns";
import { Readable } from "stream";

// Azure Blob Service setup
const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!connStr) throw new Error("Missing AZURE_STORAGE_CONNECTION_STRING");

const containerName = process.env.AZURE_BLOB_CONTAINER || "tinitiate-projects";

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const containerClient = blobServiceClient.getContainerClient(containerName);

export const saveUserDataToBlob = async (name: string, email: string) => {
  const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  const row = `${name},${email},${timestamp}\n`;
  const blobName = "user-signins.csv";

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const downloadedContent = await streamToText(downloadBlockBlobResponse.readableStreamBody);
    const newContent = downloadedContent + row;
    await blockBlobClient.upload(newContent, Buffer.byteLength(newContent));
  } catch (error) {
    await blockBlobClient.upload(row, Buffer.byteLength(row));
  }
};

export const saveLoginTimestamp = async (email: string) => {
  const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  const row = `${email},${timestamp}\n`;
  const blobName = "user-logins-timestamps.csv";

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  try {
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const downloadedContent = await streamToText(downloadBlockBlobResponse.readableStreamBody);
    const newContent = downloadedContent + row;
    await blockBlobClient.upload(newContent, newContent.length, { overwrite: true });
  } catch (error) {
    await blockBlobClient.upload(row, row.length, { overwrite: true });
  }
};

// Helper function for streaming
async function streamToText(readableStream) {
  return new Promise((resolve, reject) => {
    let data = '';
    readableStream.on('data', chunk => data += chunk);
    readableStream.on('end', () => resolve(data));
    readableStream.on('error', reject);
  });
}
