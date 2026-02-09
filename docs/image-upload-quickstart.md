# Quick Setup Guide - Image Upload System

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

New packages installed:
- `@aws-sdk/client-s3` - Cloudflare R2 client
- `multer` - File upload handling
- `sharp` - Image processing & WebP conversion

### Step 2: Set Up Cloudflare R2

#### A. Create R2 Bucket
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2 Object Storage**
3. Click **"Create bucket"**
4. Bucket name: `502-jujutsu-images` (or your choice)
5. Click **"Create bucket"**

#### B. Generate API Token
1. In R2, click **"Manage R2 API Tokens"**
2. Click **"Create API Token"**
3. Configure:
   - Name: `502-jujutsu-upload`
   - Permissions: **Object Read & Write**
   - TTL: Never expire (or set custom)
   - Bucket: Select your bucket
4. Click **"Create API Token"**
5. **⚠️ Copy credentials immediately** (shown only once):
   - Access Key ID
   - Secret Access Key

#### C. Enable Public Access
1. Go to your bucket
2. Click **"Settings"**
3. Under **"Public access"**, click **"Allow Access"**
4. Copy the public URL (format: `https://pub-xxx.r2.dev`)

### Step 3: Configure Environment Variables

Edit your `.env` file:

```bash
# Add these lines (replace with your actual credentials)

# Cloudflare R2 Storage Configuration
CLOUDFLARE_R2_ACCOUNT_ID=abc123def456
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id_here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key_here
CLOUDFLARE_R2_BUCKET_NAME=502-jujutsu-images
CLOUDFLARE_R2_PUBLIC_URL=https://pub-abc123.r2.dev
```

**Where to find Account ID:**
- Cloudflare Dashboard → R2
- Look in top-right corner

### Step 4: Restart Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 5: Test Upload

1. Open admin panel: `http://localhost:5173/admin`
2. Go to **Galería**
3. Click **"Nueva imagen"**
4. Click **"Subir archivo"** tab
5. Select an image file
6. Watch it upload and convert to WebP
7. Fill in alt text and category
8. Click **"Crear imagen"**
9. Success! 🎉

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install` completed)
- [ ] R2 bucket created in Cloudflare
- [ ] API token generated with read/write permissions
- [ ] Public access enabled on bucket
- [ ] `.env` file updated with all 5 R2 variables
- [ ] Server restarted
- [ ] Test upload successful in admin panel
- [ ] Image appears in gallery table
- [ ] Image URL is an R2 URL (starts with your public URL)

## 🎯 Usage Examples

### Gallery Image Upload
1. Admin → **Galería** → **Nueva imagen**
2. **Subir archivo** tab
3. Choose file → Wait for upload
4. Fill in: alt text, caption, category, order
5. **Crear imagen**

### Program Image Upload
1. Admin → **Programas** → Edit program
2. **Imagen del programa** section
3. Click file input → Choose image
4. Wait for upload
5. URL auto-populated
6. **Guardar cambios**

### Multiple Upload (via API)
```javascript
const formData = new FormData();
formData.append("images", file1);
formData.append("images", file2);

fetch("/api/upload/multiple?preset=gallery", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: formData
});
```

## 🐛 Troubleshooting

### "Failed to upload image"
**Check:**
1. R2 credentials in `.env` are correct
2. Bucket name matches exactly
3. API token has Object Read & Write permissions
4. Server has been restarted after editing `.env`

**Test R2 connection:**
```bash
# Check server logs for detailed error messages
npm run dev
# Look for errors mentioning "R2" or "upload"
```

### "Invalid file type"
**Supported formats:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

### Image not showing on public site
**Check:**
1. Bucket has public access enabled
2. `CLOUDFLARE_R2_PUBLIC_URL` is correct
3. Image marked as `is_active = true`
4. No CORS errors in browser console

### Sharp installation fails
**Windows:**
```bash
# Install Visual Studio Build Tools
# Then retry: npm install
```

**Linux:**
```bash
sudo apt-get install libvips-dev
npm install
```

**Mac:**
```bash
# Usually works automatically
brew install vips
npm install
```

## 📊 Image Presets

Use different presets for different purposes:

| Preset | Width | Quality | Use Case |
|--------|-------|---------|----------|
| `hero` | 1920px | 85% | Hero backgrounds |
| `program` | 1200px | 85% | Program cards |
| `gallery` | 1600px | 85% | Gallery images (default) |
| `thumbnail` | 400px | 80% | Thumbnails |
| `merchandise` | 800px | 85% | Product images |

**Specify preset in API:**
```javascript
fetch("/api/upload/image?preset=hero", ...)
```

## 💰 Cost Estimate

**Cloudflare R2 Pricing:**
- Storage: $0.015/GB/month
- Uploads: $4.50/million operations
- Downloads: $0.36/million operations
- Bandwidth: **FREE** (no egress fees!)

**Example (10,000 images):**
- 10,000 images @ 500KB = 5GB storage
- Storage cost: **$0.08/month**
- Upload cost: **$0.05 one-time**
- 100k views/month: **$0.04/month**
- **Total: ~$0.17/month** 💵

Extremely affordable!

## 📚 Documentation

Complete docs available:
- `docs/image-upload-system.md` - Full technical documentation
- `docs/image-upload-summary.md` - Implementation summary
- `CHANGELOG.md` - Feature changelog

## 🎓 Learn More

**Cloudflare R2:**
- [R2 Documentation](https://developers.cloudflare.com/r2/)
- [API Reference](https://developers.cloudflare.com/r2/api/)

**WebP Format:**
- [WebP Overview](https://developers.google.com/speed/webp)
- [Sharp Library](https://sharp.pixelplumbing.com/)

## 🆘 Need Help?

1. Check server logs: `npm run dev`
2. Review Cloudflare R2 dashboard for errors
3. Test with Postman: `POST /api/upload/image`
4. Check browser console for frontend errors
5. Verify `.env` configuration

## ✨ What's Next?

After setup, you can:
1. Replace placeholder images with real academy photos
2. Upload hero background images (category: "hero")
3. Add images to each program
4. Populate gallery with training photos
5. Upload merchandise product images

Happy uploading! 🎉
