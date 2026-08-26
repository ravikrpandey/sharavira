package config

import "os"

type Config struct {
	Port        string
	DatabaseURL string
	CORSOrigin  string
}

func Load() Config {
	return Config{Port: env("PORT", "8080"), DatabaseURL: env("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/ascend?sslmode=disable"), CORSOrigin: env("CORS_ORIGIN", "http://localhost:5173")}
}
func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
