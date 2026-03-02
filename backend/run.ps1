# Run backend with Supabase (default - data persists)
# First run: copy .env.example to .env and set SPRING_DATASOURCE_PASSWORD=nepkart9841

$envFile = Join-Path $PSScriptRoot ".env"
$exampleFile = Join-Path $PSScriptRoot ".env.example"

if (-not (Test-Path $envFile)) {
    if (Test-Path $exampleFile) {
        Copy-Item $exampleFile $envFile
        Write-Host "Created .env from .env.example" -ForegroundColor Cyan
        Write-Host "Edit backend/.env and set SPRING_DATASOURCE_PASSWORD=nepkart9841" -ForegroundColor Yellow
        Write-Host "Then run this script again." -ForegroundColor Yellow
        exit 1
    } else {
        Write-Host "Create backend/.env with Supabase credentials (see QUICKSTART.md)" -ForegroundColor Yellow
        exit 1
    }
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
