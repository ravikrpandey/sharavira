package migration

import (
	"strings"
	"testing"
)

func TestLoadSchemaIncludesSubmissionTables(t *testing.T) {
	schema, err := LoadSchema()
	if err != nil {
		t.Fatalf("expected schema migration to be readable: %v", err)
	}
	text := string(schema)
	for _, table := range []string{"contact_submissions", "newsletter_subscriptions", "request_idempotency"} {
		if !strings.Contains(text, "CREATE TABLE IF NOT EXISTS "+table) {
			t.Fatalf("expected schema to create %s", table)
		}
	}
}
