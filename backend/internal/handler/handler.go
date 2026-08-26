package handler

import (
	"encoding/json"
	"errors"
	"github.com/ascend-collective/public-site-api/internal/model"
	"github.com/ascend-collective/public-site-api/internal/repository"
	"github.com/ascend-collective/public-site-api/internal/service"
	"net/http"
	"strings"
)

type Handler struct{ service *service.Service }

func New(services *service.Service) *Handler { return &Handler{service: services} }
func (h *Handler) Content(w http.ResponseWriter, r *http.Request, contentType, slug string) {
	if r.Method != http.MethodGet {
		methodNotAllowed(w)
		return
	}
	if slug == "" {
		items, err := h.service.List(r.Context(), contentType)
		if err != nil {
			serverError(w)
			return
		}
		respond(w, http.StatusOK, items)
		return
	}
	item, err := h.service.Get(r.Context(), contentType, slug)
	if errors.Is(err, repository.ErrNotFound) {
		fail(w, http.StatusNotFound, "NOT_FOUND", "Content was not found")
		return
	}
	if err != nil {
		serverError(w)
		return
	}
	respond(w, http.StatusOK, item)
}
func (h *Handler) Search(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		methodNotAllowed(w)
		return
	}
	items, err := h.service.Search(r.Context(), r.URL.Query().Get("q"))
	if errors.Is(err, service.ErrValidation) {
		fail(w, http.StatusBadRequest, "INVALID_QUERY", "Provide a search query of at least two characters")
		return
	}
	if err != nil {
		serverError(w)
		return
	}
	respond(w, http.StatusOK, items)
}
func (h *Handler) Contact(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		methodNotAllowed(w)
		return
	}
	var v model.ContactSubmission
	if !decode(w, r, &v) {
		return
	}
	if err := h.service.SubmitContact(r.Context(), v, key(r)); err != nil {
		submissionError(w, err)
		return
	}
	respond(w, http.StatusCreated, map[string]string{"status": "received"})
}
func (h *Handler) Newsletter(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		methodNotAllowed(w)
		return
	}
	var v struct {
		Email string `json:"email"`
	}
	if !decode(w, r, &v) {
		return
	}
	if err := h.service.Subscribe(r.Context(), v.Email, key(r)); err != nil {
		submissionError(w, err)
		return
	}
	respond(w, http.StatusCreated, map[string]string{"status": "subscribed"})
}
func decode(w http.ResponseWriter, r *http.Request, dst any) bool {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
	d := json.NewDecoder(r.Body)
	d.DisallowUnknownFields()
	if err := d.Decode(dst); err != nil {
		fail(w, http.StatusBadRequest, "INVALID_BODY", "Provide a valid JSON request body")
		return false
	}
	return true
}
func key(r *http.Request) string { return strings.TrimSpace(r.Header.Get("Idempotency-Key")) }
func submissionError(w http.ResponseWriter, err error) {
	if errors.Is(err, service.ErrValidation) {
		fail(w, http.StatusBadRequest, "VALIDATION_ERROR", "Check the required fields and try again")
		return
	}
	if errors.Is(err, repository.ErrDuplicate) {
		fail(w, http.StatusConflict, "DUPLICATE_SUBMISSION", "This submission was already received")
		return
	}
	serverError(w)
}
func methodNotAllowed(w http.ResponseWriter) {
	fail(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "This method is not supported")
}
func serverError(w http.ResponseWriter) {
	fail(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Something went wrong")
}
func respond(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]any{"success": true, "data": data})
}
func fail(w http.ResponseWriter, status int, code, message string) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]any{"success": false, "message": message, "error": map[string]string{"code": code}})
}
