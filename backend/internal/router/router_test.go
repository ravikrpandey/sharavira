package router

import (
	"bytes"
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/ascend-collective/public-site-api/internal/config"
	"github.com/ascend-collective/public-site-api/internal/model"
	"github.com/ascend-collective/public-site-api/internal/repository"
	"github.com/ascend-collective/public-site-api/internal/service"
)

type routerStore struct{ contact model.ContactSubmission }

func (s *routerStore) ListContent(context.Context, string) ([]model.ContentItem, error) { return nil, nil }
func (s *routerStore) GetContent(context.Context, string, string) (model.ContentItem, error) {
	return model.ContentItem{}, repository.ErrNotFound
}
func (s *routerStore) SearchContent(context.Context, string) ([]model.ContentItem, error) { return nil, nil }
func (s *routerStore) CreateContact(_ context.Context, submission model.ContactSubmission, _ string) error {
	s.contact = submission
	return nil
}
func (s *routerStore) CreateNewsletter(context.Context, model.NewsletterSubscription, string) error { return nil }

func TestContactRouteAcceptsFullBrowserPayload(t *testing.T) {
	store := &routerStore{}
	h := New(service.New(store), config.Config{CORSOrigin: "https://ravikrpandey.github.io"})
	body := []byte(`{"firstName":"Ravi","lastName":"Pandey","company":"Ascend","email":"ravi@example.com","country":"India","reason":"Explore enterprise AI","message":"Hello","consent":true,"marketingConsent":true}`)
	request := httptest.NewRequest(http.MethodPost, "/api/v1/contact", bytes.NewReader(body))
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Idempotency-Key", "router-contact-contract-test")
	recorder := httptest.NewRecorder()

	h.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusCreated {
		t.Fatalf("expected 201 Created, got %d: %s", recorder.Code, recorder.Body.String())
	}
	if store.contact.Email != "ravi@example.com" || !store.contact.Consent || !store.contact.MarketingOK {
		t.Fatalf("expected the complete browser contract to reach storage, got %#v", store.contact)
	}
}
