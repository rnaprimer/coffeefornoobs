require('dotenv').config({ path: '.env.local' });
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function run() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME
    });
    const response = await r2Client.send(command);
    console.log("Objects in bucket:");
    console.log(response.Contents ? response.Contents.map(c => c.Key) : "None");
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
