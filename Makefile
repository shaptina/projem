# Cross-platform Makefile (Windows cmd.exe / Unix bash) for CNC/CAM/CAD project
# Usage:
#   make init   -> copy .env.example to .env
#   make dev    -> start full stack (docker compose up --build)
#   make stop   -> stop stack
#   make logs   -> tail all logs
#   make migrate/seed/test/lint/fmt/build/clean/gen-docs

# --- Shell & tools selection ---
ifeq ($(OS),Windows_NT)
  SHELL := cmd.exe
  .SHELLFLAGS := /V:ON /c
  COPY := copy /Y
  RM := del /Q
else
  SHELL := /bin/bash
  .SHELLFLAGS := -euo pipefail -c
  COPY := cp -f
  RM := rm -f
endif

DC ?= docker compose

.DEFAULT_GOAL := help

.PHONY: help init dev stop logs migrate seed test lint fmt build clean gen-docs run-freecad-smoke seed-basics

help:
	@echo.
	@echo Available targets:
	@echo   make init      - Create .env from .env.example
	@echo   make dev       - Start full dev stack (docker compose up --build)
	@echo   make stop      - Stop stack (docker compose down)
	@echo   make logs      - Follow logs from all services
	@echo   make migrate   - Run Alembic migrations
	@echo   make seed      - Seed example data
	@echo   make test      - Run API and Web tests
	@echo   make lint      - Run linters (API + Web)
	@echo   make fmt       - Auto-format code (API + Web)
	@echo   make build     - Build docker images
	@echo   make clean     - Down and remove volumes
	@echo   make gen-docs  - Generate API/docs (if script exists)
	@echo.

init:
	$(COPY) .env.example .env

dev:
	$(DC) up --build

stop:
	$(DC) down

logs:
	$(DC) logs -f

migrate:
	$(DC) exec api alembic upgrade head

seed:
	-$(DC) exec api python -m app.scripts.seed

seed-basics:
	-$(DC) exec api python -m app.scripts.seed_basics

test:
	-$(DC) exec api pytest -q
	-$(DC) exec web pnpm test

lint:
	-$(DC) exec api ruff check .
	-$(DC) exec api black --check .
	-$(DC) exec web pnpm lint

fmt:
	-$(DC) exec api ruff format
	-$(DC) exec api black .
	-$(DC) exec web pnpm format

build:
	$(DC) build

run-freecad-smoke:
	-$(DC) exec api python -m app.scripts.run_freecad_smoke

clean:
	$(DC) down -v

gen-docs:
	-$(DC) exec api python -m app.scripts.gen_docs
