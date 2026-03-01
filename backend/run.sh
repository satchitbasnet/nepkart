#!/bin/bash
# Run backend with Supabase (PostgreSQL)
# Create backend/.env from .env.example first (get password from team lead)

cd "$(dirname "$0")"

if [ ! -f .env ]; then
    echo "Create backend/.env with your database credentials (see .env.example)"
    exit 1
fi

set -a
source .env
set +a

echo "Starting backend with Supabase..."
mvn spring-boot:run
