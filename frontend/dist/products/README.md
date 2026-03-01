# Product Images

This directory contains product images for the NEPKART e-commerce platform.

## Adding Product Images

1. **Place your product images here** with descriptive filenames:
   - Example: `wai-wai-noodles.jpg`, `dhaka-topi.png`, `copper-jug.jpg`
   - Use lowercase letters, hyphens, and numbers only
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`

2. **Update product image URLs** in one of these ways:
   - **Option A**: Update in the Admin Dashboard (recommended)
     - Go to Admin → Inventory
     - Click "Choose File" next to the product image
     - Upload the image (it will be converted to base64 and stored in database)
   
   - **Option B**: Update in the database directly
     - Set `image_url` to `/products/your-image-filename.jpg`
     - Example: `/products/wai-wai-noodles.jpg`

3. **Commit and push** the images to GitHub:
   ```bash
   git add frontend/public/products/
   git commit -m "Add product images"
   git push origin main
   ```

## Image Guidelines

- **Recommended size**: 800x800px or larger (square aspect ratio)
- **File size**: Keep under 500KB per image for fast loading
- **Format**: Use JPG for photos, PNG for images with transparency, WebP for best compression
- **Naming**: Use descriptive, lowercase filenames with hyphens
  - ✅ Good: `wai-wai-noodles.jpg`, `dhaka-topi-traditional.png`
  - ❌ Bad: `IMG_1234.jpg`, `Product Image.png`

## Current Product Images Needed

Based on the products in the database, you may want to add images for:
- Wai Wai Noodles
- Churpi
- Gundruk
- Momo Masala
- Dhaka Topi
- Copper Jug
- Prayer Wheel
- Rice Bag (5kg)
- Brass Panas Lamps
- 3-Set Moon Singing Bowl
- Tibetan Rug
- Antique Peacock Window
