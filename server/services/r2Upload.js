// ---------------------------------------------------------------------------
// Cloudflare R2 Upload Service
// Handles image uploads, WebP conversion, and R2 storage
// ---------------------------------------------------------------------------
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");
const crypto = require("crypto");

// Configure S3 client for Cloudflare R2
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Generate a unique filename for uploaded images
 * Format: {timestamp}-{random}.webp
 */
function generateFileName() {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString("hex");
  return `${timestamp}-${randomString}.webp`;
}

/**
 * Convert image buffer to WebP format with optimization
 * @param {Buffer} buffer - Original image buffer
 * @param {Object} options - Sharp options
 * @returns {Promise<Buffer>} - Optimized WebP buffer
 */
async function convertToWebP(buffer, options = {}) {
  const {
    width = 1920,
    quality = 85,
    fit = "inside",
  } = options;

  try {
    return await sharp(buffer)
      .resize(width, null, { 
        fit,
        withoutEnlargement: true,
      })
      .webp({ 
        quality,
        effort: 6, // Higher effort = better compression (0-6)
      })
      .toBuffer();
  } catch (err) {
    console.error("Error converting image to WebP:", err);
    throw new Error("Failed to process image");
  }
}

/**
 * Upload image buffer to Cloudflare R2
 * @param {Buffer} buffer - Image buffer
 * @param {string} fileName - File name
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} - Public URL of uploaded image
 */
async function uploadToR2(buffer, fileName, contentType = "image/webp") {
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

  if (!bucketName || !publicUrl) {
    throw new Error("Cloudflare R2 configuration missing");
  }

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000", // Cache for 1 year
    });

    await r2Client.send(command);
    
    // Return public URL
    return `${publicUrl}/${fileName}`;
  } catch (err) {
    console.error("Error uploading to R2:", err);
    throw new Error("Failed to upload image to storage");
  }
}

/**
 * Delete image from Cloudflare R2
 * @param {string} fileUrl - Full URL of the file to delete
 * @returns {Promise<boolean>} - Success status
 */
async function deleteFromR2(fileUrl) {
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

  if (!fileUrl || !fileUrl.startsWith(publicUrl)) {
    // Not an R2 file, skip deletion
    return false;
  }

  try {
    // Extract file key from URL
    const fileName = fileUrl.replace(`${publicUrl}/`, "");
    
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    await r2Client.send(command);
    return true;
  } catch (err) {
    console.error("Error deleting from R2:", err);
    // Don't throw error, just log it
    return false;
  }
}

/**
 * Process and upload image file
 * Main function that handles the complete upload pipeline:
 * 1. Convert to WebP
 * 2. Optimize
 * 3. Upload to R2
 * 4. Return public URL
 * 
 * @param {Buffer} buffer - Original image buffer
 * @param {Object} options - Processing options
 * @returns {Promise<string>} - Public URL of uploaded image
 */
async function processAndUploadImage(buffer, options = {}) {
  try {
    // Convert and optimize image
    const webpBuffer = await convertToWebP(buffer, options);
    
    // Generate unique filename
    const fileName = generateFileName();
    
    // Upload to R2
    const publicUrl = await uploadToR2(webpBuffer, fileName);
    
    return publicUrl;
  } catch (err) {
    console.error("Error processing and uploading image:", err);
    throw err;
  }
}

/**
 * Get image size presets for different use cases
 */
const IMAGE_PRESETS = {
  hero: { width: 1920, quality: 85 },      // Hero backgrounds
  program: { width: 1200, quality: 85 },   // Program cards
  gallery: { width: 1600, quality: 85 },   // Gallery images
  thumbnail: { width: 400, quality: 80 },  // Thumbnails
  merchandise: { width: 800, quality: 85 }, // Product images
};

module.exports = {
  processAndUploadImage,
  deleteFromR2,
  IMAGE_PRESETS,
  convertToWebP,
  uploadToR2,
  generateFileName,
};
