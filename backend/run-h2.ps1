# Run backend with H2 (no Supabase - use when cloud DB is unreachable)
# Clears any postgres env vars so H2 is used

$env:SPRING_DATASOURCE_URL = $null
$env:SPRING_DATASOURCE_USERNAME = $null
$env:SPRING_DATASOURCE_PASSWORD = $null
$env:SPRING_PROFILES_ACTIVE = $null

Write-Host "Starting backend with H2 (local database)..." -ForegroundColor Green
mvn spring-boot:run
