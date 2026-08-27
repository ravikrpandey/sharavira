package service

import "testing"

func TestResolveSenderFallsBackToAuthenticatedGmailAddress(t *testing.T) {
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
