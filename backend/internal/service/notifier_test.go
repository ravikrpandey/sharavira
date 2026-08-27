package service

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"net/mail"
	"net/url"
	"strings"
	"sync/atomic"
	"testing"

	"github.com/ascend-collective/public-site-api/internal/model"
)

func TestResolveSenderFallsBackToConfiguredMailbox(t *testing.T) {
	sender, err := resolveSender("Sharavira Technology", "mailer@example.com")
	if err != nil {
		t.Fatalf("expected fallback sender, got %v", err)
	}
	if sender.Address != "mailer@example.com" || sender.Name != "Sharavira Technology" {
		t.Fatalf("unexpected fallback sender: %#v", sender)
	}
}

func TestResolveSenderUsesConfiguredMailbox(t *testing.T) {
	sender, err := resolveSender("Sharavira Technology <mailer@example.com>", "other@example.com")
	if err != nil {
		t.Fatalf("expected configured sender, got %v", err)
	}
	if sender.Address != "mailer@example.com" || sender.Name != "Sharavira Technology" {
		t.Fatalf("unexpected configured sender: %#v", sender)
	}
}

func TestGmailNotifierSendsInquiryViaHTTPS(t *testing.T) {
	var sendCalls atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/token":
			if r.Method != http.MethodPost {
				t.Errorf("token method = %s, want POST", r.Method)
			}
			if got := r.Header.Get("Content-Type"); got != "application/x-www-form-urlencoded" {
				t.Errorf("token content type = %q", got)
			}
			body, err := io.ReadAll(r.Body)
			if err != nil {
				t.Errorf("read token body: %v", err)
			}
			values, err := url.ParseQuery(string(body))
			if err != nil {
				t.Errorf("parse token body: %v", err)
			}
			for key, want := range map[string]string{
				"client_id":     "client-id",
				"client_secret": "client-secret",
				"refresh_token": "refresh-token",
				"grant_type":    "refresh_token",
			} {
				if got := values.Get(key); got != want {
					t.Errorf("token %s = %q, want %q", key, got, want)
				}
			}
			w.Header().Set("Content-Type", "application/json")
			_, _ = io.WriteString(w, `{"access_token":"access-token"}`)
		case "/send":
			sendCalls.Add(1)
			if r.Method != http.MethodPost {
				t.Errorf("send method = %s, want POST", r.Method)
			}
			if got := r.Header.Get("Authorization"); got != "Bearer access-token" {
				t.Errorf("authorization = %q", got)
			}
			var payload struct {
				Raw string `json:"raw"`
			}
			if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
				t.Errorf("decode Gmail payload: %v", err)
			}
			decoded, err := base64.RawURLEncoding.DecodeString(payload.Raw)
			if err != nil {
				t.Errorf("decode raw Gmail message: %v", err)
			}
			rawMessage := string(decoded)
			for _, want := range []string{
				"To: <pandeyravikumar181@gmail.com>",
				"Reply-To: prospect@example.com",
				"Subject: New website enquiry from Asha Rao",
				"New Sharavira Technology enquiry",
				"Need an AI strategy",
			} {
				if !strings.Contains(rawMessage, want) {
					t.Errorf("raw message does not contain %q: %s", want, rawMessage)
				}
			}
			w.Header().Set("Content-Type", "application/json")
			_, _ = io.WriteString(w, `{"id":"message-id"}`)
		default:
			http.NotFound(w, r)
		}
	}))
	defer server.Close()

	notifier := &gmailInquiryNotifier{
		clientID:     "client-id",
		clientSecret: "client-secret",
		refreshToken: "refresh-token",
		from:         "Sharavira Technology",
		recipient:    "pandeyravikumar181@gmail.com",
		httpClient:   server.Client(),
		tokenURL:     server.URL + "/token",
		sendURL:      server.URL + "/send",
	}
	inquiry := model.ContactSubmission{
		FirstName: "Asha", LastName: "Rao", Company: "Example Co", Email: "prospect@example.com",
		Country: "India", Reason: "Explore enterprise AI", Message: "Need an AI strategy", MarketingOK: true,
	}

	if err := notifier.NotifyInquiry(context.Background(), inquiry, "idempotency-key"); err != nil {
		t.Fatalf("NotifyInquiry() error = %v", err)
	}
	if got := sendCalls.Load(); got != 1 {
		t.Fatalf("send calls = %d, want 1", got)
	}
}

func TestNewGmailAPIInquiryNotifierUsesNoopWhenOAuthSettingsAreIncomplete(t *testing.T) {
	notifier := NewGmailAPIInquiryNotifier("", "client-secret", "refresh-token", "", "owner@example.com")
	if _, ok := notifier.(noopInquiryNotifier); !ok {
		t.Fatalf("incomplete Gmail settings should create noop notifier, got %T", notifier)
	}
}

func TestResolveSenderRejectsInvalidFallbackMailbox(t *testing.T) {
	if _, err := resolveSender("Sharavira Technology", "not-an-email"); err == nil {
		t.Fatal("expected invalid fallback mailbox to fail")
	}
	if _, err := mail.ParseAddress("not-an-email"); err == nil {
		t.Fatal("expected net/mail to reject invalid fallback mailbox")
	}
}
