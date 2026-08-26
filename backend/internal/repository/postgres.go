package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"github.com/ascend-collective/public-site-api/internal/model"
	_ "github.com/lib/pq"
	"strings"
	"time"
)

type PostgresStore struct{ db *sql.DB }

func NewPostgres(databaseURL string) (*PostgresStore, error) {
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(12)
	db.SetMaxIdleConns(4)
	db.SetConnMaxLifetime(30 * time.Minute)
	if err := db.Ping(); err != nil {
		db.Close()
		return nil, err
	}
	return &PostgresStore{db: db}, nil
}
func (store *PostgresStore) Close() error { return store.db.Close() }
func (store *PostgresStore) ListContent(ctx context.Context, contentType string) ([]model.ContentItem, error) {
	rows, err := store.db.QueryContext(ctx, `SELECT id::text, content_type, slug, title, summary, body, published_at FROM content_items WHERE content_type=$1 AND published=true ORDER BY published_at DESC`, contentType)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []model.ContentItem{}
	for rows.Next() {
		item, err := scanContent(rows)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}
func (store *PostgresStore) GetContent(ctx context.Context, contentType, slug string) (model.ContentItem, error) {
	row := store.db.QueryRowContext(ctx, `SELECT id::text, content_type, slug, title, summary, body, published_at FROM content_items WHERE content_type=$1 AND slug=$2 AND published=true`, contentType, slug)
	item, err := scanContent(row)
	if errors.Is(err, sql.ErrNoRows) {
		return model.ContentItem{}, ErrNotFound
	}
	return item, err
}
func (store *PostgresStore) SearchContent(ctx context.Context, query string) ([]model.ContentItem, error) {
	rows, err := store.db.QueryContext(ctx, `SELECT id::text, content_type, slug, title, summary, body, published_at FROM content_items WHERE published=true AND search_vector @@ websearch_to_tsquery('english', $1) ORDER BY ts_rank(search_vector, websearch_to_tsquery('english', $1)) DESC LIMIT 20`, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []model.ContentItem{}
	for rows.Next() {
		item, err := scanContent(rows)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}
func (store *PostgresStore) CreateContact(ctx context.Context, submission model.ContactSubmission, key string) error {
	return store.withIdempotency(ctx, key, func(tx *sql.Tx) error {
		_, err := tx.ExecContext(ctx, `INSERT INTO contact_submissions (first_name,last_name,company,email,country,reason,message,marketing_consent) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, submission.FirstName, submission.LastName, submission.Company, strings.ToLower(submission.Email), submission.Country, submission.Reason, submission.Message, submission.MarketingOK)
		return err
	})
}
func (store *PostgresStore) CreateNewsletter(ctx context.Context, subscription model.NewsletterSubscription, key string) error {
	return store.withIdempotency(ctx, key, func(tx *sql.Tx) error {
		result, err := tx.ExecContext(ctx, `INSERT INTO newsletter_subscriptions (email,status) VALUES ($1,'active') ON CONFLICT (email) DO NOTHING`, strings.ToLower(subscription.Email))
		if err != nil {
			return err
		}
		count, _ := result.RowsAffected()
		if count == 0 {
			return ErrDuplicate
		}
		return nil
	})
}
func (store *PostgresStore) withIdempotency(ctx context.Context, key string, work func(*sql.Tx) error) error {
	tx, err := store.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	result, err := tx.ExecContext(ctx, `INSERT INTO request_idempotency (idempotency_key, expires_at) VALUES ($1, NOW() + INTERVAL '24 hours') ON CONFLICT DO NOTHING`, key)
	if err != nil {
		return err
	}
	count, _ := result.RowsAffected()
	if count == 0 {
		return ErrDuplicate
	}
	if err := work(tx); err != nil {
		return err
	}
	return tx.Commit()
}

type scanner interface{ Scan(...any) error }

func scanContent(row scanner) (model.ContentItem, error) {
	var item model.ContentItem
	var body []byte
	err := row.Scan(&item.ID, &item.ContentType, &item.Slug, &item.Title, &item.Summary, &body, &item.PublishedAt)
	if err != nil {
		return model.ContentItem{}, err
	}
	item.Body = json.RawMessage(body)
	return item, nil
}
