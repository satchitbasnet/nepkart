# Run backend with H2 (fallback when Supabase is unreachable)
# Data persists in backend/data/ but use Supabase (run.ps1) for long-term

$env:SPRING_PROFILES_ACTIVE = "h2"

Write-Host "Starting backend with H2 (local fallback)..." -ForegroundColor Yellow
mvn spring-boot:run
