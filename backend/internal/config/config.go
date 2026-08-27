package config

import "os"

type Config struct {
	Port                  string
	DatabaseURL           string
	CORSOrigin            string
	SMTPHost              string
	SMTPPort              string
	SMTPUsername          string
	SMTPPassword          string
	InquiryEmailFrom      string
	InquiryNotificationTo string
}

func Load() Config {
	return Config{
		Port: env("PORT", "8080"), DatabaseURL: env("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/ascend?sslmode=disable"), CORSOrigin: env("CORS_ORIGIN", "http://localhost:5173"),
		SMTPHost: env("SMTP_HOST", "smtp.gmail.com"), SMTPPort: env("SMTP_PORT", "587"), SMTPUsername: env("SMTP_USERNAME", ""), SMTPPassword: env("SMTP_PASSWORD", ""),
		InquiryEmailFrom: env("INQUIRY_EMAIL_FROM", ""), InquiryNotificationTo: env("INQUIRY_NOTIFICATION_TO", ""),
	}
}
func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
