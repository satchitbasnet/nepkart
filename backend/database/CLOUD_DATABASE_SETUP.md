# Cloud Database Setup

NEPKART uses **Supabase (PostgreSQL)** by default. All developers connect to the same shared database.

---

## Quick Setup (After Pulling Repo)

1. Copy `backend/.env.example` to `backend/.env`
2. Add the database password (get from your team lead or Supabase project settings)
3. Run the backend: `.\run-with-postgres.ps1` (Windows) or `./run.sh` (Mac/Linux)

---

## Option 1: Supabase (Default – Free Tier)

1. **Create account** at [supabase.com](https://supabase.com)
2. **New project** → Choose a name, set a database password (save it!)
3. **Get connection details** → Project Settings → Database
4. **Connection string** (Direct):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

---

## Option 2: Neon (Free Tier)

1. **Create account** at [neon.tech](https://neon.tech)
2. **Create project** → Copy the connection string
3. Format: `postgresql://user:password@host/dbname?sslmode=require`

---

## Option 3: Railway (Free Tier)

1. **Create account** at [railway.app](https://railway.app)
2. **New project** → Add PostgreSQL
3. **Variables** → Copy `DATABASE_URL` (convert to JDBC format if needed)

---

## Configure Your App

### Step 1: Create `.env` in `backend/` folder

```env
SPRING_PROFILES_ACTIVE=postgres
SPRING_DATASOURCE_URL=jdbc:postgresql://your-host:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-password
```

**Supabase example:**
```env
SPRING_PROFILES_ACTIVE=postgres
SPRING_DATASOURCE_URL=jdbc:postgresql://db.abcdefgh.supabase.co:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-database-password
```

### Step 2: Run the backend

**Option A – Use the run script (easiest):**
```powershell
cd backend
.\run-with-postgres.ps1
```

**Option B – Set env vars manually:**
```powershell
$env:SPRING_PROFILES_ACTIVE="postgres"
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://db.xxx.supabase.co:5432/postgres"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="your-password"
cd backend; mvn spring-boot:run
```

The first run will:
- Create tables (JPA `ddl-auto=update`)
- Seed products (DataInitializer, if DB is empty)

---

## On a New Computer

1. **Clone the repo**
2. **Create `backend/.env`** with your connection details (or copy from a secure place)
3. **Run backend** with postgres profile loaded

The `.env` file is in `.gitignore`—**never commit it**. Store your credentials securely (password manager, etc.).

---

## Switching Back to Local H2

Omit the postgres profile to use the default H2 in-memory database:

```powershell
# Don't set SPRING_PROFILES_ACTIVE, or set it to something other than postgres
mvn spring-boot:run
```

---

## Security Notes

- Never commit `.env` or database passwords to Git
- Use strong passwords for your cloud database
- Supabase/Neon/Railway use SSL by default—your connection is encrypted
