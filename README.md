# CookFlow Front End Forked Repo

## Shortcut
chmod +x run_tests.sh
./run_tests.sh
---

### For Multi Container: Use Docker Compose

```bash
docker compose down
docker compose up --build -d
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```
(create the superuser)

### Seed Data
```bash
docker compose exec backend python manage.py seed_all
```

### Run Cypress
```bash
docker compose run --rm cypress
```
===

### To Build Only Front
```bash
docker compose build frontend
```

### To Build Only Back
```bash
docker compose build backend
```
===

### To Apply Migrations
```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
```

### To Create Superuser
```bash
docker compose exec backend python manage.py createsuperuser
```

### To Seed Data
```bash
docker compose exec backend python manage.py seed_all
```