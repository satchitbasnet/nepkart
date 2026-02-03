# How to Start the Backend Server

## Quick Start

1. **Open a terminal** and navigate to the backend directory:
   ```bash
   cd /Users/satchit/CURSOR/backend
   ```

2. **Start the backend server**:
   ```bash
   mvn spring-boot:run
   ```

3. **Wait for the server to start** - You should see:
   ```
   Started NepkartApplication in X.XXX seconds
   ```

4. **Verify it's running** - Open your browser and go to:
   ```
   http://localhost:8080/api/products
   ```
   You should see a JSON array of products.

## Prerequisites Check

Before starting, make sure you have:

### 1. Java 17+ installed
```bash
java -version
```
Should show version 17 or higher.

### 2. Maven installed
```bash
mvn -version
```
Should show Maven version 3.6 or higher.

### 3. Database Running

**If using PostgreSQL:**
```bash
# Check if PostgreSQL is running
pg_isready

# Or check if you can connect
psql -U postgres -c '\q'
```

**If using H2 (in-memory database):**
- No setup needed, it starts automatically with Spring Boot

## Troubleshooting

### Port 8080 already in use
If you get an error about port 8080 being in use:
```bash
# Find what's using port 8080
lsof -i :8080

# Kill the process (replace PID with actual process ID)
kill -9 PID
```

### Maven not found
Install Maven:
- macOS: `brew install maven`
- Or download from: https://maven.apache.org/download.cgi

### Java not found
Install Java 17+:
- macOS: `brew install openjdk@17`
- Or download from: https://adoptium.net/

### Database connection error
Check your `application.properties` file:
- Verify database credentials
- Make sure PostgreSQL is running (if using PostgreSQL)
- Check database name exists

## Keep Backend Running

**Important**: Keep the terminal window open while the backend is running. Closing it will stop the server.

To stop the backend, press `Ctrl + C` in the terminal where it's running.
