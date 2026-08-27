package config

import "testing"

func TestLoadReadsGmailOAuthSettings(t *testing.T) {
	t.Setenv("GMAIL_CLIENT_ID", "client-id")
	t.Setenv("GMAIL_CLIENT_SECRET", "client-secret")
	t.Setenv("GMAIL_REFRESH_TOKEN", "refresh-token")
	t.Setenv("INQUIRY_EMAIL_FROM", "Sharavira Technology <sender@example.com>")
	t.Setenv("INQUIRY_NOTIFICATION_TO", "owner@example.com")

	cfg := Load()
	if cfg.GmailClientID != "client-id" || cfg.GmailClientSecret != "client-secret" || cfg.GmailRefreshToken != "refresh-token" {
		t.Fatalf("Gmail OAuth settings were not loaded: %#v", cfg)
	}
	if cfg.InquiryEmailFrom != "Sharavira Technology <sender@example.com>" || cfg.InquiryNotificationTo != "owner@example.com" {
		t.Fatalf("inquiry email settings were not loaded: %#v", cfg)
	}
}
