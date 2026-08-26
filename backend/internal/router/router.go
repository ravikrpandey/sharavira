package router

import (
	"github.com/ascend-collective/public-site-api/internal/config"
	"github.com/ascend-collective/public-site-api/internal/handler"
	"github.com/ascend-collective/public-site-api/internal/middleware"
	"github.com/ascend-collective/public-site-api/internal/service"
	"net/http"
	"strings"
	"time"
)

var types = map[string]string{"pages": "page", "solutions": "solution", "industries": "industry", "platforms": "platform", "customers": "customer", "resources": "resource", "capabilities": "capability"}

func New(services *service.Service, cfg config.Config) http.Handler {
	h := handler.New(services)
	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"ok":true}`))
	})
	mux.HandleFunc("/api/v1/", func(w http.ResponseWriter, r *http.Request) {
		path := strings.Trim(strings.TrimPrefix(r.URL.Path, "/api/v1/"), "/")
		parts := strings.Split(path, "/")
		if len(parts) == 0 || parts[0] == "" {
			http.NotFound(w, r)
			return
		}
		if parts[0] == "search" {
			h.Search(w, r)
			return
		}
		if parts[0] == "contact" {
			h.Contact(w, r)
			return
		}
		if parts[0] == "newsletter" {
			h.Newsletter(w, r)
			return
		}
		contentType, ok := types[parts[0]]
		if !ok {
			http.NotFound(w, r)
			return
		}
		slug := ""
		if len(parts) > 1 {
			slug = parts[1]
		}
		h.Content(w, r, contentType, slug)
	})
	return middleware.Security(middleware.CORS(cfg.CORSOrigin, middleware.NewRateLimiter(8, time.Minute).Limit(mux)))
}
