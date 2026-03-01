# NEPKART Quick Start Guide

## Prerequisites
- Node.js (v16+) and npm
- Java 17+
- Maven 3.6+

## Quick Setup

### 1. Start the Backend (Java Spring Boot)

```bash
cd backend
cp .env.example .env
# Edit .env and set SPRING_DATASOURCE_PASSWORD=nepkart9841

# Windows
.\run-with-postgres.ps1

# Mac/Linux
./run.sh
```

**Supabase password:** `nepkart9841`

The backend will start on `http://localhost:8081`

### 2. Start the Frontend (React)

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Access Points

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:8081/api

## Sample Data

The backend automatically initializes with 8 sample products on first run:
- Wai Wai Noodles
- Churpi
- Gundruk (Out of Stock)
- Momo Masala
- Dhaka Topi
- Copper Jug
- Prayer Wheel
- Rice Bag (5kg)

## Testing the Application

1. Browse products on the home page
2. Click on a product to see details
3. Add items to cart
4. Proceed to checkout
5. View admin dashboard at `/admin` to see inventory management

## Troubleshooting

### Backend won't start
- Ensure Java 17+ is installed: `java -version`
- Create `backend/.env` from `.env.example` and set `SPRING_DATASOURCE_PASSWORD=nepkart9841`
- Check if port 8081 is available

### Frontend won't start
- Ensure Node.js is installed: `node -v`
- Run `npm install` in the frontend directory
- Check if port 5173 is available

### API connection issues
- Ensure backend is running before starting frontend
- Check CORS configuration in backend
- Verify API base URL in `frontend/src/app/services/api.ts` (default: `http://localhost:8081/api`)
