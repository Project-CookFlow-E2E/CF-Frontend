# CookFlow Front End Forked Repo

CI

## Option 1: Start Cypress in Interactive mode

```bash
docker compose up -d --build backend --force-recreate
# Start in interactive mode
docker compose run --rm \
  --entrypoint "" \
  cypress \
  sh -c "cd /e2e && npx cypress open --project ./"
```

---

### 1. Build Docker & Run it

```bash
docker compose down --volumes
docker-compose build
docker-compose up -d
docker-compose exec backend python manage.py createsuperuser
```
### Seed Data
```bash
docker compose exec backend python manage.py seed_all
docker-compose up -d
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

# To Start Cypress in Interactive mode

```bash
docker compose up -d --build backend --force-recreate
# Start in interactive mode
docker compose run --rm \
  --entrypoint "" \
  cypress \
  sh -c "cd /e2e && npx cypress open --project ./"
```
