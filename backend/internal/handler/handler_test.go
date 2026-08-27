package handler

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/ascend-collective/public-site-api/internal/model"
	"github.com/ascend-collective/public-site-api/internal/repository"
	"github.com/ascend-collective/public-site-api/internal/service"
)

type contactStore struct{ contact model.ContactSubmission }

func (s *contactStore) ListContent(context.Context, string) ([]model.ContentItem, error) { return nil, nil }
func (s *contactStore) GetContent(context.Context, string, string) (model.ContentItem, error) {
	return model.ContentItem{}, repository.ErrNotFound
}
func (s *contactStore) SearchContent(context.Context, string) ([]model.ContentItem, error) { return nil, nil }
func (s *contactStore) CreateContact(_ context.Context, submission model.ContactSubmission, _ string) error {
	s.contact = submission
	return nil
}
func (s *contactStore) CreateNewsletter(context.Context, model.NewsletterSubscription, string) error { return nil }

func TestDecodeContactAcceptsLegacyConsentField(t *testing.T) {
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/api/v1/contact", strings.NewReader(`{"firstName":"Ravi","lastName":"Pandey","company":"Ascend","email":"ravi@example.com","country":"India","reason":"Explore enterprise AI","message":"Hello","consent":true,"marketingConsent":true}`))
	var submission model.ContactSubmission

	if ok := decode(recorder, request, &submission); !ok {
		t.Fatalf("expected the backwards-compatible contact payload to decode")
	}
	if !submission.Consent || !submission.MarketingOK || submission.Email != "ravi@example.com" {
		t.Fatalf("expected consent fields and email to be decoded, got %#v", submission)
	}
}

func TestDecodeContactRejectsUnexpectedFields(t *testing.T) {
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/api/v1/contact", strings.NewReader(`{"firstName":"Ravi","unexpected":true}`))
	var submission model.ContactSubmission

	if ok := decode(recorder, request, &submission); ok {
		t.Fatal("expected unknown fields to be rejected")
	}
	if recorder.Code != 400 {
		t.Fatalf("expected 400 for unknown field, got %d", recorder.Code)
	}
}

func TestContactAcceptsTheBrowserPayloadAndCreatesAnInquiry(t *testing.T) {
	store := &contactStore{}
	endpoint := New(service.New(store))
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, "/api/v1/contact", strings.NewReader(`{"firstName":"Ravi","lastName":"Pandey","company":"Ascend","email":"ravi@example.com","country":"India","reason":"Explore enterprise AI","message":"Hello","consent":true,"marketingConsent":true}`))
	request.Header.Set("Idempotency-Key", "contact-handler-contract-test")

	endpoint.Contact(recorder, request)

	if recorder.Code != http.StatusCreated {
		t.Fatalf("expected contact to be created, got %d: %s", recorder.Code, recorder.Body.String())
	}
	if store.contact.Email != "ravi@example.com" || !store.contact.Consent || !store.contact.MarketingOK {
		t.Fatalf("expected decoded contact to reach the service, got %#v", store.contact)
	}
}
