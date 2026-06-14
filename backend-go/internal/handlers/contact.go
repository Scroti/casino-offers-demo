package handlers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"github.com/playwise-guru/backend/internal/auth"
	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/services"
)

type ContactHandler struct{ svc *services.ContactService }

func NewContactHandler(svc *services.ContactService) *ContactHandler {
	return &ContactHandler{svc: svc}
}

type createContactReq struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Subject  string `json:"subject" validate:"required"`
	Category string `json:"category" validate:"required,oneof=general technical billing account feedback other"`
	Message  string `json:"message" validate:"required"`
}

func (h *ContactHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req createContactReq
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	msg := &models.ContactMessage{
		Name: req.Name, Email: req.Email, Subject: req.Subject,
		Category: req.Category, Message: req.Message,
	}
	if claims, ok := auth.ClaimsFromContext(r.Context()); ok {
		msg.UserID = &claims.UserID
	}
	created, err := h.svc.Create(r.Context(), msg)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{"message": "received", "id": created.ID})
}

func (h *ContactHandler) List(w http.ResponseWriter, r *http.Request) {
	limit, offset := paginationParams(r, 100)
	out, err := h.svc.List(r.Context(), limit, offset)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, out)
}

func (h *ContactHandler) Get(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	c, err := h.svc.Get(r.Context(), id)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, c)
}

func (h *ContactHandler) MarkRead(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.svc.MarkRead(r.Context(), id); err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"message": "ok"})
}

type resolveContactReq struct {
	Response *string `json:"response,omitempty"`
}

func (h *ContactHandler) Resolve(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	var req resolveContactReq
	if err := decodeJSON(r, &req); err != nil {
		// Empty body is OK — just mark resolved.
		req = resolveContactReq{}
	}
	if err := h.svc.Resolve(r.Context(), id, req.Response); err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"message": "ok"})
}
