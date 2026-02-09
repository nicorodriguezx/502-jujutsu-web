# Visual Enhancements - Setup Guide

## Quick Start

Follow these steps to implement the visual enhancements (background images, hero carousel, program images).

### 1. Run the Database Migration

```bash
# Make sure your database is running
# Run the migration
psql -d jujutsu_502 -f database/migration-002-visual-enhancements.sql
```

This will:
- Add `image_url` column to the `programs` table
- Add new site_content keys for hero carousel configuration
- Add sample hero images to the gallery (Unsplash placeholders)
- Update hero text to be more action-oriented

### 2. Restart the Backend Server

```bash
# Stop the current server (Ctrl+C)
# Start it again
npm run dev
```

The backend changes will:
- Return `image_url` in programs API responses
- Return `id` in gallery API responses (needed for React keys)
- Support all existing gallery category filtering

### 3. Restart the Frontend Dev Server

```bash
# In the client directory
cd client
# Stop the current server (Ctrl+C)
# Start it again
npm run dev
```

The frontend changes include:
- Hero background image carousel
- Enhanced program cards with images
- Visual hover effects and transitions

### 4. Add Real Hero Images (Admin Panel)

1. Navigate to **Admin Panel → Galería**
2. Click "Nueva imagen"
3. Fill in the form:
   - **URL de imagen**: Your hero background image URL
   - **Texto alt**: Descriptive text (e.g., "Niños entrenando Jūjutsu en 502 Jujutsu")
   - **Leyenda**: Optional caption
   - **Categoría**: Select **"hero"**
   - **Orden**: Set order (1, 2, 3, etc.)
   - **Activo**: Check this box
4. Click "Crear imagen"
5. Repeat for multiple hero images (3-5 recommended)

**Recommended Hero Images:**
- Kids training (Little Champs in action)
- Adults concentrating during training
- Close-up of technique demonstration
- Wide shot showing dojo energy
- Instructor teaching students

**Image Specifications:**
- Minimum resolution: 1920x1080px
- Aspect ratio: 16:9 (landscape)
- Format: JPEG or PNG
- File size: < 500KB (optimized for web)
- Action shots with good lighting
- Avoid overly dark or busy backgrounds

### 5. Add Program Images (Optional)

1. Navigate to **Admin Panel → Programas**
2. Edit an existing program
3. In the **"URL de imagen (opcional)"** field, enter the image URL
4. Click "Guardar cambios"
5. Repeat for each program

**Recommended Program Images:**
- Program-specific action shots
- Age-appropriate imagery
- Clear, well-lit photos
- Aspect ratio: 4:3 or similar
- Resolution: 800x600px minimum

### 6. Verify Everything Works

#### Check Hero Carousel:
1. Visit the public site: http://localhost:5173
2. Observe the hero section background
3. Wait 5 seconds to see automatic image transitions
4. Verify overlay darkness allows text to be readable

#### Check Program Cards:
1. Scroll to "Nuestros Programas" section
2. If program images are added, they should appear in card headers
3. Hover over cards to see animations (scale, shadow, translate)

#### Check Admin Panel:
1. Visit: http://localhost:5173/admin
2. Go to Galería - verify "hero" is in the category dropdown
3. Go to Programas - verify "URL de imagen" field appears in forms

### 7. Customize Carousel Settings (Optional)

1. Navigate to **Admin Panel → Contenido**
2. Find and edit these keys:

**hero_background_overlay_opacity**
- Default: `0.6`
- Range: `0.0` (no overlay) to `1.0` (completely dark)
- Recommendation: Keep between `0.5` and `0.7` for text readability

**hero_image_transition_interval**
- Default: `5000` (5 seconds)
- Set in milliseconds (e.g., `7000` = 7 seconds)
- Recommendation: Between 4000-8000ms

## Troubleshooting

### Hero images not showing:
- Check that images have `category = "hero"` in the gallery
- Check that images are marked as `is_active = TRUE`
- Verify image URLs are valid and accessible
- Check browser console for 404 errors

### Carousel not transitioning:
- Check that you have multiple hero images (need at least 2)
- Verify `hero_image_transition_interval` is set correctly
- Check browser console for JavaScript errors

### Program images not showing:
- Verify `image_url` field is filled in for the program
- Check that image URLs are valid
- Inspect browser console for 404 or CORS errors

### Backend errors after migration:
- Verify migration ran successfully: `\d programs` in psql should show `image_url` column
- Restart backend server
- Check server logs for errors

### Frontend not updating:
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Restart frontend dev server

## Image Hosting Recommendations

For production, consider using:

1. **Cloudflare R2** (Recommended)
   - S3-compatible storage
   - No egress fees
   - Fast global CDN
   - Admin upload integration ready (future enhancement)

2. **Imgur**
   - Free image hosting
   - Direct linking allowed
   - Good for testing

3. **Unsplash** (Temporary only)
   - Use for placeholders during development
   - Replace with real academy photos for production

4. **Self-hosted**
   - Place images in `client/public/images/`
   - Reference as `/images/filename.jpg`
   - Not recommended for production (use CDN instead)

## Next Steps

After implementing these visual enhancements, consider:

1. **Add more training photos** to gallery with various categories
2. **Implement image upload** directly in admin panel (Cloudflare R2)
3. **Optimize images** for web (compression, WebP format)
4. **Add lazy loading** for better performance
5. **Implement parallax effects** (infrastructure already prepared)

## Need Help?

Refer to:
- `docs/visual-enhancements-implementation.md` - Full technical documentation
- `CHANGELOG.md` - Complete list of changes
- `README.md` - Updated design system section
