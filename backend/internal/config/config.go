package config

import "os"

type Config struct {
	Port                  string
	DatabaseURL           string
	CORSOrigin            string
	GmailClientID         string
	GmailClientSecret     string
	GmailRefreshToken     string
	InquiryEmailFrom      string
	InquiryNotificationTo string
}

func Load() Config {
	return Config{
		Port:                  env("PORT", "8080"),
		DatabaseURL:           env("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/ascend?sslmode=disable"),
		CORSOrigin:            env("CORS_ORIGIN", "http://localhost:5173"),
		GmailClientID:         env("GMAIL_CLIENT_ID", ""),
		GmailClientSecret:     env("GMAIL_CLIENT_SECRET", ""),
		GmailRefreshToken:     env("GMAIL_REFRESH_TOKEN", ""),
		InquiryEmailFrom:      env("INQUIRY_EMAIL_FROM", ""),
		InquiryNotificationTo: env("INQUIRY_NOTIFICATION_TO", ""),
	}
}

func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
