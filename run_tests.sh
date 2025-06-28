#!/bin/bash

echo "--- Stopping and removing existing containers and volumes ---"
docker compose down --volumes

echo "--- Building Docker images (including curl in backend) ---"
docker compose build

echo "--- Starting database service ---"
docker compose up -d db

echo "--- Waiting for database to be healthy (using docker inspect) ---"
until [ "$(docker inspect -f '{{.State.Health.Status}}' cookflow-frontend-db-1 2>/dev/null)" = "healthy" ]; do
    echo "Waiting for db container to be healthy..."
    sleep 5
done
echo "--- Database is healthy. ---"

echo "--- Starting backend service (migrations will run as part of startup) ---"
docker compose up -d backend

echo "--- Waiting for backend to become healthy (using docker inspect) ---"
# This wait will now correctly reflect whether the Django app is serving requests
# This implies that migrations (which are part of the backend's startup command) are complete.
until [ "$(docker inspect -f '{{.State.Health.Status}}' cookflow-frontend-backend-1 2>/dev/null)" = "healthy" ]; do
    echo "Waiting for backend container to be healthy..."
    sleep 5
done
echo "--- Backend is healthy. ---"

echo "--- Creating superuser 'tester' programmatically (tester@tester.com / testpass123) ---"
PYTHON_SCRIPT="
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from users.models import CustomUser

try:
    if not CustomUser.objects.filter(username='tester').exists():
        CustomUser.objects.create_superuser(
            username='tester',
            email='tester@tester.com',
            password='testpass123',
            name='tester',
            surname='tester',
            second_surname='tester'
        )
        print(\"Superuser 'tester' created successfully.\")
    else:
        print(\"Superuser 'tester' already exists.\")
except Exception as e:
    print(f\"Error creating superuser: {e}\")
    import traceback
    traceback.print_exc()
    exit(1) # Exit with an error code if superuser creation fails
"
docker compose exec -T backend python -c "$PYTHON_SCRIPT"

if [ $? -ne 0 ]; then
    echo "Superuser creation failed. Exiting."
    docker compose logs backend
    exit 1
fi

echo "--- Seeding the database with initial data ---"
docker compose exec -T backend python manage.py seed_all

if [ $? -ne 0 ]; then
    echo "Seeding failed. Exiting."
    docker compose logs backend
    exit 1
fi

echo "--- Starting frontend and cypress for tests ---"
docker compose up -d frontend cypress

echo "--- Running Cypress tests ---"
docker compose run --rm cypress
test_exit_code=$?

if [ $test_exit_code -ne 0 ]; then
    echo "Cypress tests failed."
else
    echo "Cypress tests passed successfully."
fi

echo "--- Shutting down all services ---"
docker compose down --volumes

exit $test_exit_code