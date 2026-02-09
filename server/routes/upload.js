// ---------------------------------------------------------------------------
// Image Upload Routes
// Handles file uploads with WebP conversion and R2 storage
// ---------------------------------------------------------------------------
const { Router } = require("express");
const multer = require("multer");
const { processAndUploadImage, deleteFromR2, IMAGE_PRESETS } = require("../services/r2Upload");

const router = Router();

// Configure multer for memory storage (we'll process in-memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (_req, file, cb) => {
    // Accept only image files
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."));
    }
  },
});

/**
 * POST /api/upload/image
 * Upload a single image, convert to WebP, and store in R2
 * 
 * Query params:
 *   - preset: hero|program|gallery|thumbnail|merchandise (optional)
 *   - width: custom width in pixels (optional)
 *   - quality: 1-100 (optional)
 * 
 * Returns: { url: "https://..." }
 */
router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Get processing options from query params
    const preset = req.query.preset || "gallery";
    const customWidth = req.query.width ? parseInt(req.query.width) : null;
    const customQuality = req.query.quality ? parseInt(req.query.quality) : null;

    // Use preset or custom options
    const options = IMAGE_PRESETS[preset] || IMAGE_PRESETS.gallery;
    if (customWidth) options.width = customWidth;
    if (customQuality) options.quality = customQuality;

    // Process and upload
    const imageUrl = await processAndUploadImage(req.file.buffer, options);

    return res.status(201).json({ 
      url: imageUrl,
      originalName: req.file.originalname,
      size: req.file.size,
      preset: preset,
    });
  } catch (err) {
    console.error("POST /api/upload/image error:", err);
    
    if (err.message.includes("Invalid file type")) {
      return res.status(400).json({ error: err.message });
    }
    
    return res.status(500).json({ error: "Failed to upload image" });
  }
});

/**
 * POST /api/upload/multiple
 * Upload multiple images at once
 * Same query params as single upload
 * 
 * Returns: { urls: ["https://...", ...] }
 */
router.post("/multiple", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No image files provided" });
    }

    // Get processing options
    const preset = req.query.preset || "gallery";
    const customWidth = req.query.width ? parseInt(req.query.width) : null;
    const customQuality = req.query.quality ? parseInt(req.query.quality) : null;

    const options = IMAGE_PRESETS[preset] || IMAGE_PRESETS.gallery;
    if (customWidth) options.width = customWidth;
    if (customQuality) options.quality = customQuality;

    // Process all images in parallel
    const uploadPromises = req.files.map(file => 
      processAndUploadImage(file.buffer, options)
    );

    const imageUrls = await Promise.all(uploadPromises);

    return res.status(201).json({ 
      urls: imageUrls,
      count: imageUrls.length,
      preset: preset,
    });
  } catch (err) {
    console.error("POST /api/upload/multiple error:", err);
    return res.status(500).json({ error: "Failed to upload images" });
  }
});

/**
 * DELETE /api/upload/image
 * Delete an image from R2 storage
 * 
 * Body: { url: "https://..." }
 * 
 * Returns: { success: true }
 */
router.delete("/image", async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    const deleted = await deleteFromR2(url);

    if (deleted) {
      return res.json({ success: true, message: "Image deleted" });
    } else {
      return res.json({ success: false, message: "Image not found or not an R2 URL" });
    }
  } catch (err) {
    console.error("DELETE /api/upload/image error:", err);
    return res.status(500).json({ error: "Failed to delete image" });
  }
});

/**
 * GET /api/upload/presets
 * Get available image processing presets
 * 
 * Returns: { presets: {...} }
 */
router.get("/presets", (_req, res) => {
  return res.json({ 
    presets: IMAGE_PRESETS,
    description: "Available image processing presets with width and quality settings",
  });
});

module.exports = router;
