package service

import (
	"context"
	"github.com/ascend-collective/public-site-api/internal/model"
	"github.com/ascend-collective/public-site-api/internal/repository"
	"testing"
)

type memoryStore struct {
	contacts    int
	newsletters int
}

func (memoryStore) ListContent(context.Context, string) ([]model.ContentItem, error) { return nil, nil }
func (memoryStore) GetContent(context.Context, string, string) (model.ContentItem, error) {
	return model.ContentItem{}, repository.ErrNotFound
}
func (memoryStore) SearchContent(context.Context, string) ([]model.ContentItem, error) {
	return nil, nil
}
func (s *memoryStore) CreateContact(context.Context, model.ContactSubmission, string) error {
	s.contacts++
	return nil
}
func (s *memoryStore) CreateNewsletter(context.Context, model.NewsletterSubscription, string) error {
	s.newsletters++
	return nil
}
func TestSubmitContactValidatesRequiredFields(t *testing.T) {
	store := &memoryStore{}
	service := New(store)
	err := service.SubmitContact(context.Background(), model.ContactSubmission{FirstName: "A", LastName: "B", Company: "C", Email: "not-an-email", Country: "US", Reason: "Explore"}, "key-1")
	if err != ErrValidation {
		t.Fatalf("expected validation error, got %v", err)
	}
	if store.contacts != 0 {
		t.Fatalf("invalid submission must not persist")
	}
}
func TestSubscribeAcceptsValidEmail(t *testing.T) {
	store := &memoryStore{}
	service := New(store)
	if err := service.Subscribe(context.Background(), "person@example.com", "key-2"); err != nil {
		t.Fatalf("expected valid subscription, got %v", err)
	}
	if store.newsletters != 1 {
		t.Fatalf("expected one subscription")
	}
}
