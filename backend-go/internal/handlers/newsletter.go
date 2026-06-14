package handlers

import (
	"net/http"

	"github.com/playwise-guru/backend/internal/services"
)

type NewsletterHandler struct{ svc *services.NewsletterService }

func NewNewsletterHandler(svc *services.NewsletterService) *NewsletterHandler {
	return &NewsletterHandler{svc: svc}
}

type emailReq struct {
	Email string `json:"email" validate:"required,email"`
}

func (h *NewsletterHandler) Subscribe(w http.ResponseWriter, r *http.Request) {
	var req emailReq
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	sub, err := h.svc.Subscribe(r.Context(), req.Email)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"subscribed": true, "subscription": sub})
}

func (h *NewsletterHandler) Unsubscribe(w http.ResponseWriter, r *http.Request) {
	var req emailReq
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	sub, err := h.svc.Unsubscribe(r.Context(), req.Email)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"unsubscribed": true, "subscription": sub})
}

func (h *NewsletterHandler) Check(w http.ResponseWriter, r *http.Request) {
	var req emailReq
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	sub, err := h.svc.IsSubscribed(r.Context(), req.Email)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"subscribed": sub})
}
