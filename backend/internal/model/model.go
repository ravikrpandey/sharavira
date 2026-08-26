package model

import (
	"encoding/json"
	"time"
)

type ContentItem struct {
	ID          string          `json:"id"`
	ContentType string          `json:"contentType"`
	Slug        string          `json:"slug"`
	Title       string          `json:"title"`
	Summary     string          `json:"summary"`
	Body        json.RawMessage `json:"body"`
	PublishedAt time.Time       `json:"publishedAt"`
}
type ContactSubmission struct {
	ID          string    `json:"id"`
	FirstName   string    `json:"firstName"`
	LastName    string    `json:"lastName"`
	Company     string    `json:"company"`
	Email       string    `json:"email"`
	Country     string    `json:"country"`
	Reason      string    `json:"reason"`
	Message     string    `json:"message"`
	MarketingOK bool      `json:"marketingConsent"`
	CreatedAt   time.Time `json:"createdAt"`
}
type NewsletterSubscription struct {
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"createdAt"`
}
