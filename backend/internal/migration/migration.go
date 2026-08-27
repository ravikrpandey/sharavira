package migration

import (
	"context"
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

var schemaPaths = []string{
	"../database/migrations/001_initial.sql",
	"../../database/migrations/001_initial.sql",
	"../../../database/migrations/001_initial.sql",
	"database/migrations/001_initial.sql",
}

func LoadSchema() ([]byte, error) {
	var lastErr error
	for _, path := range schemaPaths {
		schema, err := os.ReadFile(path)
		if err == nil {
			return schema, nil
		}
		lastErr = err
	}
	return nil, fmt.Errorf("read schema migration: %w", lastErr)
}

func Apply(ctx context.Context, databaseURL string) error {
	schema, err := LoadSchema()
	if err != nil {
		return err
	}
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return fmt.Errorf("open database: %w", err)
	}
	defer db.Close()
	if err := db.PingContext(ctx); err != nil {
		return fmt.Errorf("connect database: %w", err)
	}
	if _, err := db.ExecContext(ctx, string(schema)); err != nil {
		return fmt.Errorf("apply schema: %w", err)
	}
	return nil
}
