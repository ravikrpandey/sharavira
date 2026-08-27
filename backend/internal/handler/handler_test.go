package handler

import (
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/ascend-collective/public-site-api/internal/model"
)

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
