package main

import (
	"context"
	"database/sql"
	"log"
	"os"
	"path/filepath"
	"time"

	_ "github.com/lib/pq"
)

func main() {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}

	schemaPath := filepath.Clean("../database/migrations/001_initial.sql")
	schema, err := os.ReadFile(schemaPath)
	if err != nil {
		log.Fatalf("read migration %s: %v", schemaPath, err)
	}

	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		log.Fatalf("open database: %v", err)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		log.Fatalf("connect database: %v", err)
	}
	if _, err := db.ExecContext(ctx, string(schema)); err != nil {
		log.Fatalf("apply migration: %v", err)
	}
	log.Println("database migration complete")
}
