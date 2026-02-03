# How to Add Product Images to GitHub

Your product images are currently stored on your MacBook. To make them available to your collaborators, follow these steps:

## Step 1: Copy Images to the Repository

1. **Copy your product images** to the `frontend/public/products/` folder:
   ```bash
   # Example: Copy images from your MacBook to the project
   cp /path/to/your/images/*.jpg /Users/satchit/CURSOR/frontend/public/products/
   cp /path/to/your/images/*.png /Users/satchit/CURSOR/frontend/public/products/
   ```

2. **Or manually copy**:
   - Open Finder
   - Navigate to where your product images are stored
   - Copy the image files
   - Paste them into: `/Users/satchit/CURSOR/frontend/public/products/`

## Step 2: Name Your Images Properly

Use descriptive, lowercase filenames:
- `wai-wai-noodles.jpg`
- `churpi.jpg`
- `dhaka-topi.png`
- `copper-jug.jpg`
- etc.

## Step 3: Add Images to Git

```bash
cd /Users/satchit/CURSOR

# Add all product images
git add frontend/public/products/

# Check what will be committed
git status

# Commit the images
git commit -m "Add product images for e-commerce catalog"

# Push to GitHub
git push origin main
```

## Step 4: Update Product Image URLs

You have two options:

### Option A: Update via Admin Dashboard (Easiest)
1. Start your backend: `cd backend && mvn spring-boot:run`
2. Start your frontend: `cd frontend && npm start`
3. Go to Admin Dashboard → Inventory
4. For each product, click "Choose File" and upload the image
5. Click "Save" - images will be converted to base64 and stored in the database

### Option B: Update Database Directly
If you want to use the image files from `/products/` folder:

1. Update the `image_url` field in the database to point to your images:
   ```sql
   UPDATE products SET image_url = '/products/wai-wai-noodles.jpg' WHERE sku = 'NEP-FOOD-001';
   UPDATE products SET image_url = '/products/churpi.jpg' WHERE sku = 'NEP-FOOD-002';
   -- etc.
   ```

2. Or update via the Admin Dashboard by entering the path in the image URL field

## Step 5: Verify Images Are Visible

1. Pull the latest changes on another machine:
   ```bash
   git pull origin main
   ```

2. Start the application and check that images load correctly

## Important Notes

- **Image files must be committed to Git** for collaborators to see them
- **Base64 images** (uploaded via Admin Dashboard) are stored in the database and don't need separate files
- **File-based images** (in `/products/` folder) need to be committed to Git
- **Recommended**: Use base64 storage (Option A) for simplicity, or commit image files (Option B) for better performance

## Troubleshooting

### Images not showing?
- Check that images are committed: `git ls-files | grep products`
- Verify image paths match what's in the database
- Check browser console for 404 errors
- Ensure images are in `frontend/public/products/` (not `frontend/src/`)

### Images too large?
- Compress images before adding: Use tools like ImageOptim or TinyPNG
- Keep files under 500KB each
- Consider using WebP format for better compression
