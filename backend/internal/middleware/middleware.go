package middleware

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"
)

func Security(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
		next.ServeHTTP(w, r)
	})
}
func CORS(origin string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Origin") == origin {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Idempotency-Key")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		}
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

type RateLimiter struct {
	mu     sync.Mutex
	visits map[string][]time.Time
	limit  int
	window time.Duration
}

func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	return &RateLimiter{visits: map[string][]time.Time{}, limit: limit, window: window}
}
func (l *RateLimiter) Limit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			next.ServeHTTP(w, r)
			return
		}
		host, _, _ := net.SplitHostPort(r.RemoteAddr)
		if host == "" {
			host = strings.TrimSpace(r.RemoteAddr)
		}
		now := time.Now()
		l.mu.Lock()
		recent := l.visits[host][:0]
		for _, visit := range l.visits[host] {
			if now.Sub(visit) < l.window {
				recent = append(recent, visit)
			}
		}
		if len(recent) >= l.limit {
			l.visits[host] = recent
			l.mu.Unlock()
			http.Error(w, `{"success":false,"message":"Too many requests","error":{"code":"RATE_LIMITED"}}`, http.StatusTooManyRequests)
			return
		}
		l.visits[host] = append(recent, now)
		l.mu.Unlock()
		next.ServeHTTP(w, r)
	})
}
