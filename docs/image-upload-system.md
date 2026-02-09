# Image Upload System - Cloudflare R2 with WebP Conversion

## Overview

Complete image upload system with:
- Direct file uploads from admin panel
- Automatic WebP conversion for optimization
- Cloudflare R2 storage integration
- Multiple image presets for different use cases
- Support for both file upload and URL input

## Features

### 🎨 WebP Conversion
- All uploaded images automatically converted to WebP format
- Configurable quality (default 85%)
- Smart resizing based on preset
- Up to 80% smaller file sizes vs JPEG/PNG

### ☁️ Cloudflare R2 Storage
- S3-compatible storage
- No egress fees
- Global CDN distribution
- Secure credential-based access

### 📋 Image Presets
Pre-configured settings for different use cases:
- **hero**: 1920px width, 85% quality (hero backgrounds)
- **program**: 1200px width, 85% quality (program cards)
- **gallery**: 1600px width, 85% quality (gallery images)
- **thumbnail**: 400px width, 80% quality (thumbnails)
- **merchandise**: 800px width, 85% quality (products)

### 🔐 Security
- Protected endpoints (JWT required)
- File type validation (JPEG, PNG, WebP, GIF only)
- 10MB file size limit
- Secure credential storage in .env

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

New dependencies added:
- `@aws-sdk/client-s3` - S3-compatible client for R2
- `multer` - File upload middleware
- `sharp` - Image processing library

### 2. Configure Cloudflare R2

#### Create R2 Bucket:
1. Log in to Cloudflare Dashboard
2. Go to R2 Object Storage
3. Click "Create bucket"
4. Name it: `502-jujutsu-images` (or your choice)
5. Click "Create bucket"

#### Generate API Tokens:
1. In R2 dashboard, click "Manage R2 API Tokens"
2. Click "Create API Token"
3. Token name: `502-jujutsu-upload`
4. Permissions: Object Read & Write
5. Apply to specific bucket: `502-jujutsu-images`
6. Click "Create API Token"
7. **Copy the credentials immediately** (shown only once)

#### Get Public URL:
1. Go to your bucket settings
2. Under "Public access", click "Connect domain" or "Allow access"
3. Note the public URL format: `https://pub-xxx.r2.dev`
4. Or connect a custom domain (e.g., `https://images.502jujutsu.com`)

### 3. Update Environment Variables

Edit `.env` file:

```bash
# Cloudflare R2 Storage Configuration
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id_here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key_here
CLOUDFLARE_R2_BUCKET_NAME=502-jujutsu-images
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

**Where to find Account ID:**
- Cloudflare Dashboard → R2 → Your bucket
- Top right corner shows Account ID

### 4. Restart Server

```bash
npm run dev
```

## Usage

### Admin Panel - Gallery Images

1. Go to **Galería** in admin panel
2. Click "Nueva imagen"
3. Two upload options:

**Option A: Upload File**
- Click "Subir archivo" tab
- Select category (training, facilities, hero, etc.)
- Click file input and select image
- Image automatically uploads, converts to WebP, and stores in R2
- Preview appears after successful upload
- Fill in alt text, caption, order
- Click "Crear imagen"

**Option B: External URL**
- Click "URL externa" tab
- Paste image URL
- Fill in other fields
- Click "Crear imagen"

### Admin Panel - Program Images

1. Go to **Programas** in admin panel
2. Create new or edit existing program
3. In "Imagen del programa" section:

**Option A: Upload File**
- Click file input
- Select image
- Waits for upload and conversion
- URL automatically populated

**Option B: Enter URL**
- Type or paste URL in text field

4. Fill in other program details
5. Click "Guardar cambios"

## API Endpoints

### POST /api/upload/image
Upload single image with WebP conversion.

**Authentication:** Bearer token required

**Content-Type:** multipart/form-data

**Body:**
- `image`: File (JPEG, PNG, WebP, or GIF)

**Query Parameters:**
- `preset`: hero|program|gallery|thumbnail|merchandise (optional, default: gallery)
- `width`: Custom width in pixels (optional, overrides preset)
- `quality`: 1-100 (optional, overrides preset)

**Response:**
```json
{
  "url": "https://pub-xxx.r2.dev/1234567890-abcdef.webp",
  "originalName": "photo.jpg",
  "size": 2048576,
  "preset": "hero"
}
```

**Example using fetch:**
```javascript
const formData = new FormData();
formData.append("image", fileInput.files[0]);

const response = await fetch("/api/upload/image?preset=hero", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const data = await response.json();
console.log(data.url); // Use this URL
```

### POST /api/upload/multiple
Upload multiple images at once (max 10).

**Authentication:** Bearer token required

**Content-Type:** multipart/form-data

**Body:**
- `images`: File[] (array of files)

**Query Parameters:** Same as single upload

**Response:**
```json
{
  "urls": [
    "https://pub-xxx.r2.dev/1234567890-abc.webp",
    "https://pub-xxx.r2.dev/1234567891-def.webp"
  ],
  "count": 2,
  "preset": "gallery"
}
```

### DELETE /api/upload/image
Delete image from R2 storage.

**Authentication:** Bearer token required

**Content-Type:** application/json

**Body:**
```json
{
  "url": "https://pub-xxx.r2.dev/1234567890-abcdef.webp"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted"
}
```

### GET /api/upload/presets
Get available image processing presets.

**Authentication:** Bearer token required

**Response:**
```json
{
  "presets": {
    "hero": { "width": 1920, "quality": 85 },
    "program": { "width": 1200, "quality": 85 },
    "gallery": { "width": 1600, "quality": 85 },
    "thumbnail": { "width": 400, "quality": 80 },
    "merchandise": { "width": 800, "quality": 85 }
  },
  "description": "Available image processing presets..."
}
```

## File Structure

```
server/
├── services/
│   └── r2Upload.js          # R2 upload service with WebP conversion
├── routes/
│   └── upload.js            # Upload API endpoints
└── index.js                 # Server (includes upload routes)

client/src/pages/
├── GalleryImages.jsx        # Gallery admin with file upload
└── Programs.jsx             # Programs admin with file upload
```

## Image Processing Pipeline

```
1. User selects file in admin panel
   ↓
2. File sent to /api/upload/image
   ↓
3. Multer receives file in memory
   ↓
4. Sharp converts to WebP
   ↓
5. Image resized based on preset
   ↓
6. Quality optimization applied
   ↓
7. Upload to Cloudflare R2
   ↓
8. Public URL returned
   ↓
9. URL saved to database
   ↓
10. Image displayed on public site
```

## WebP Conversion Details

### Supported Input Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

### Output Format
- Always WebP (.webp)
- Progressive encoding
- High compression efficiency

### Optimization Settings
```javascript
{
  quality: 85,           // 85% quality (good balance)
  effort: 6,             // Maximum compression effort
  withoutEnlargement: true, // Don't upscale small images
}
```

### File Size Comparison
Original → WebP:
- JPEG (2MB) → WebP (400KB) = 80% reduction
- PNG (5MB) → WebP (800KB) = 84% reduction
- Already WebP → Optimized further

## Troubleshooting

### Upload fails with "Invalid file type"
- Check file extension is .jpg, .jpeg, .png, .webp, or .gif
- Verify MIME type is correct

### Upload fails with "Failed to upload"
- Check R2 credentials in .env
- Verify bucket name is correct
- Ensure API token has read/write permissions
- Check Cloudflare R2 dashboard for errors

### Images not showing on site
- Verify R2 bucket has public access enabled
- Check CLOUDFLARE_R2_PUBLIC_URL is correct
- Test URL directly in browser
- Check browser console for CORS errors

### "Sharp" installation errors
- Sharp requires native dependencies
- On Windows: Install Visual Studio Build Tools
- On Linux: Install libvips-dev
- On Mac: Automatically installed via npm

### File size limit exceeded
- Default limit: 10MB
- To increase: Edit `upload.js` → `limits.fileSize`
- Consider image optimization before upload

## Performance Considerations

### WebP Benefits
- 25-35% smaller than JPEG at same quality
- 80%+ smaller than PNG for photos
- Supports transparency (like PNG)
- Supported by all modern browsers

### R2 Benefits
- No egress fees (free bandwidth)
- Global CDN included
- Fast uploads and downloads
- S3-compatible API

### Caching
- Images cached for 1 year (`max-age=31536000`)
- Cloudflare CDN caches at edge
- Browser caches locally
- Updates require new filename (auto-generated)

## Security Best Practices

1. **Never commit .env file**
   - Listed in .gitignore
   - Contains sensitive credentials

2. **Rotate API tokens periodically**
   - Generate new tokens every 6 months
   - Revoke old tokens in Cloudflare

3. **Limit token permissions**
   - Only Object Read & Write
   - Apply to specific bucket only

4. **Validate file uploads**
   - File type checking enabled
   - Size limits enforced
   - JWT authentication required

5. **Monitor R2 usage**
   - Check Cloudflare dashboard regularly
   - Set up usage alerts
   - Review access logs

## Cost Estimation

Cloudflare R2 Pricing (as of 2024):
- Storage: $0.015/GB/month
- Class A operations (write): $4.50/million
- Class B operations (read): $0.36/million
- Egress: **FREE** (no bandwidth charges)

Example: 10,000 images @ 500KB each:
- Storage: 5GB = $0.08/month
- Uploads: 10,000 = $0.05
- Reads: 100,000/month = $0.04
- **Total: ~$0.17/month**

Extremely cost-effective compared to alternatives!

## Future Enhancements

Potential improvements (not yet implemented):
- [ ] Image cropping tool in admin
- [ ] Automatic thumbnail generation
- [ ] Image optimization on existing images
- [ ] Bulk upload interface
- [ ] Image gallery with drag-drop ordering
- [ ] Delete old images when replacing
- [ ] Progressive image loading
- [ ] Responsive image srcsets

## Support

For issues:
1. Check Cloudflare R2 dashboard for errors
2. Review server logs for detailed error messages
3. Verify .env configuration
4. Test API endpoints with Postman
5. Check browser console for frontend errors

## References

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [WebP Format Specification](https://developers.google.com/speed/webp)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)
