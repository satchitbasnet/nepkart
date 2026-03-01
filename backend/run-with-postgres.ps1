# Run backend with Supabase (PostgreSQL)
# Create backend/.env from .env.example first (get password from team lead)

$envFile = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "Create backend/.env with your database credentials (see .env.example)" -ForegroundColor Yellow
    exit 1
}

Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($key, $value, 'Process')
    }
}

Write-Host "Starting backend with Supabase..." -ForegroundColor Green
mvn spring-boot:run
