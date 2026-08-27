package service

import (
	"context"
	"errors"
	"testing"

	"github.com/ascend-collective/public-site-api/internal/model"
	"github.com/ascend-collective/public-site-api/internal/repository"
)

type memoryStore struct {
	contacts    int
	newsletters int
	contactErr  error
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
	return s.contactErr
}
func (s *memoryStore) CreateNewsletter(context.Context, model.NewsletterSubscription, string) error {
	s.newsletters++
	return nil
}

type recordingNotifier struct {
	calls int
	err   error
}

func (n *recordingNotifier) NotifyInquiry(context.Context, model.ContactSubmission, string) error {
	n.calls++
	return n.err
}

func validInquiry() model.ContactSubmission {
	return model.ContactSubmission{FirstName: "A", LastName: "B", Company: "C", Email: "person@example.com", Country: "US", Reason: "Explore"}
}

func TestSubmitContactValidatesRequiredFields(t *testing.T) {
	store := &memoryStore{}
	svc := New(store)
	err := svc.SubmitContact(context.Background(), model.ContactSubmission{FirstName: "A", LastName: "B", Company: "C", Email: "not-an-email", Country: "US", Reason: "Explore"}, "key-1")
	if err != ErrValidation {
		t.Fatalf("expected validation error, got %v", err)
	}
	if store.contacts != 0 {
		t.Fatalf("invalid submission must not persist")
	}
}

func TestSubscribeAcceptsValidEmail(t *testing.T) {
	store := &memoryStore{}
	svc := New(store)
	if err := svc.Subscribe(context.Background(), "person@example.com", "key-2"); err != nil {
		t.Fatalf("expected valid subscription, got %v", err)
	}
	if store.newsletters != 1 {
		t.Fatalf("expected one subscription")
	}
}

func TestSubmitContactNotifiesOnlyAfterSuccessfulPersistence(t *testing.T) {
	store, notifier := &memoryStore{}, &recordingNotifier{}
	svc := NewWithNotifier(store, notifier)
	err := svc.SubmitContact(context.Background(), validInquiry(), "key-3")
	if err != nil || store.contacts != 1 || notifier.calls != 1 {
		t.Fatalf("expected persistence followed by one notification, contacts=%d notifications=%d err=%v", store.contacts, notifier.calls, err)
	}
}

func TestSubmitContactKeepsAcceptedInquiryWhenNotificationFails(t *testing.T) {
	store, notifier := &memoryStore{}, &recordingNotifier{err: errors.New("provider unavailable")}
	svc := NewWithNotifier(store, notifier)
	err := svc.SubmitContact(context.Background(), validInquiry(), "key-4")
	if err != nil || store.contacts != 1 || notifier.calls != 1 {
		t.Fatalf("expected persisted inquiry despite notification failure, contacts=%d notifications=%d err=%v", store.contacts, notifier.calls, err)
	}
}

func TestSubmitContactDoesNotNotifyWhenPersistenceFails(t *testing.T) {
	store, notifier := &memoryStore{contactErr: repository.ErrDuplicate}, &recordingNotifier{}
	svc := NewWithNotifier(store, notifier)
	err := svc.SubmitContact(context.Background(), validInquiry(), "key-5")
	if !errors.Is(err, repository.ErrDuplicate) || notifier.calls != 0 {
		t.Fatalf("expected failed persistence without notification, notifications=%d err=%v", notifier.calls, err)
	}
}
