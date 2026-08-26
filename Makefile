.PHONY: dev check test build go-test go-build compose-up

dev:
	pnpm dev

check:
	pnpm check

test:
	pnpm test

build:
	pnpm build

go-test:
	cd backend && go test ./...

go-build:
	cd backend && go build ./cmd/server

compose-up:
	docker compose up --build
