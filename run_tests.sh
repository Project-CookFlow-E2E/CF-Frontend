#!/bin/bash

echo "--- Stopping and cleaning up previous Docker containers and volumes ---"
docker compose down --volumes

echo "--- Building Docker images ---"
docker compose build

echo "--- Starting core services (db, backend, frontend) in detached mode ---"
docker compose up -d db backend frontend

sleep 10 # Adjust this sleep duration if you still face issues with the next command

echo "--- Applying Django database migrations ---"
docker compose exec backend python manage.py migrate

# --- NEW: Create the superuser 'tester' BEFORE running seed_all ---
echo "--- Creating superuser 'tester' (tester@tester.com / testpass123) ---"
printf "testpass123\ntestpass123\n" | docker compose exec -T backend python manage.py createsuperuser --username tester --email tester@tester.com --noinput
echo "--- Seeding the database with initial data ---"
docker compose exec backend python manage.py seed_all
echo "--- Running Cypress tests ---"
docker compose up cypress --abort-on-container-exit

echo "--- Test run complete ---"