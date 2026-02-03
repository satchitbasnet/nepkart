# Troubleshooting Guide: Failed to Fetch Products

If you're seeing "Failed to fetch products" error in the frontend, follow these steps:

## Step 1: Check if Backend is Running

The backend must be running on port 8080 for the frontend to work.

### Check Backend Status:
```bash
# In the backend directory
cd backend
mvn spring-boot:run
```

You should see:
```
Started NepkartApplication in X.XXX seconds
```

### Verify Backend is Accessible:
Open your browser and go to:
```
http://localhost:8080/api/products
```

You should see a JSON array of products. If you get an error, the backend isn't running properly.

## Step 2: Check Frontend Port

The frontend should be running on a different port (usually 3000, 5173, or 5174 for Vite).

```bash
# In the frontend directory
cd frontend
npm start
# or
npm run dev
```

Check the console output for the port number.

## Step 3: Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab for errors:

1. **Network Errors**: Look for red error messages
2. **CORS Errors**: Look for "CORS policy" or "Access-Control-Allow-Origin" errors
3. **Connection Errors**: Look for "Failed to fetch" or "NetworkError"

## Step 4: Verify API Configuration

The frontend is configured to use:
- **Default**: `http://localhost:8080/api`
- **Environment Variable**: `VITE_API_BASE_URL` (if set)

Check if you have a `.env` file in the frontend directory:
```bash
cd frontend
cat .env
```

If you need to change the API URL, create a `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

## Step 5: Check Database Connection

The backend needs a database connection. Check:

1. **PostgreSQL is running** (if using PostgreSQL):
   ```bash
   # Check if PostgreSQL is running
   pg_isready
   ```

2. **Database credentials** in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/nepkartdb
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   ```

3. **Database exists**:
   ```sql
   -- Connect to PostgreSQL
   psql -U postgres
   
   -- Check if database exists
   \l
   
   -- Connect to database
   \c nepkartdb
   
   -- Check if products table exists
   \dt
   ```

## Step 6: Check CORS Configuration

The backend CORS configuration should allow your frontend origin. Check `backend/src/main/java/com/nepkart/config/CorsConfig.java`:

```java
config.addAllowedOriginPattern("http://localhost:*");
```

This should allow any localhost port.

## Step 7: Common Issues and Solutions

### Issue: "Failed to fetch" or Network Error
**Solution**: 
- Backend is not running → Start backend: `cd backend && mvn spring-boot:run`
- Wrong port → Check backend is on port 8080
- Firewall blocking → Check firewall settings

### Issue: CORS Error
**Solution**:
- Check CORS configuration in `CorsConfig.java`
- Ensure frontend origin matches allowed origins
- Restart backend after changing CORS config

### Issue: 404 Not Found
**Solution**:
- Check API endpoint: Should be `/api/products`
- Verify backend controller mapping: `@RequestMapping("/api/products")`
- Check backend logs for route mapping

### Issue: 500 Internal Server Error
**Solution**:
- Check backend logs for detailed error
- Verify database connection
- Check if database tables exist
- Verify product data initialization

### Issue: Empty Array Returned
**Solution**:
- Database might be empty
- Check `DataInitializer.java` - it should create sample products
- Verify database connection is working
- Check backend logs for initialization messages

## Step 8: Enable Detailed Logging

Add console logging to see what's happening:

1. **Frontend**: Open browser console (F12) - logging is already enabled
2. **Backend**: Check console output when starting Spring Boot

## Step 9: Test API Directly

Use curl or Postman to test the API:

```bash
# Test products endpoint
curl http://localhost:8080/api/products

# Should return JSON array of products
```

## Step 10: Check Both Servers Are Running

You need BOTH servers running:

**Terminal 1 - Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# or
npm run dev
```

## Still Having Issues?

1. **Check browser console** for specific error messages
2. **Check backend logs** for server-side errors
3. **Verify network tab** in browser DevTools to see the actual HTTP request/response
4. **Check if port 8080 is already in use**:
   ```bash
   lsof -i :8080
   # or
   netstat -an | grep 8080
   ```

## Quick Fix Checklist

- [ ] Backend is running (`mvn spring-boot:run`)
- [ ] Frontend is running (`npm start` or `npm run dev`)
- [ ] Backend is accessible at `http://localhost:8080/api/products`
- [ ] Database is running and connected
- [ ] No CORS errors in browser console
- [ ] Check browser console for detailed error messages
- [ ] Verify API_BASE URL matches backend URL
