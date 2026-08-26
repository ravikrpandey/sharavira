package service

import (
	"context"
	"errors"
	"github.com/ascend-collective/public-site-api/internal/model"
	"github.com/ascend-collective/public-site-api/internal/repository"
	"net/mail"
	"strings"
	"time"
)

var ErrValidation = errors.New("validation failed")

type Service struct{ store repository.Store }

func New(store repository.Store) *Service { return &Service{store: store} }
func (s *Service) List(ctx context.Context, contentType string) ([]model.ContentItem, error) {
	return s.store.ListContent(ctx, contentType)
}
func (s *Service) Get(ctx context.Context, contentType, slug string) (model.ContentItem, error) {
	return s.store.GetContent(ctx, contentType, slug)
}
func (s *Service) Search(ctx context.Context, query string) ([]model.ContentItem, error) {
	if len(strings.TrimSpace(query)) < 2 {
		return nil, ErrValidation
	}
	return s.store.SearchContent(ctx, query)
}
func (s *Service) SubmitContact(ctx context.Context, v model.ContactSubmission, key string) error {
	v.FirstName, v.LastName, v.Company, v.Country, v.Reason = strings.TrimSpace(v.FirstName), strings.TrimSpace(v.LastName), strings.TrimSpace(v.Company), strings.TrimSpace(v.Country), strings.TrimSpace(v.Reason)
	v.Email = strings.ToLower(strings.TrimSpace(v.Email))
	if v.FirstName == "" || v.LastName == "" || v.Company == "" || v.Country == "" || v.Reason == "" || !validEmail(v.Email) || len(v.Message) > 4000 || key == "" {
		return ErrValidation
	}
	v.CreatedAt = time.Now().UTC()
	return s.store.CreateContact(ctx, v, key)
}
func (s *Service) Subscribe(ctx context.Context, email, key string) error {
	email = strings.ToLower(strings.TrimSpace(email))
	if !validEmail(email) || key == "" {
		return ErrValidation
	}
	return s.store.CreateNewsletter(ctx, model.NewsletterSubscription{Email: email, CreatedAt: time.Now().UTC()}, key)
}
func validEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil && strings.Count(email, "@") == 1
}
