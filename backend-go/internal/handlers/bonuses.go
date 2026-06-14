package handlers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/services"
)

type BonusHandler struct{ svc *services.BonusService }

func NewBonusHandler(svc *services.BonusService) *BonusHandler { return &BonusHandler{svc: svc} }

func (h *BonusHandler) List(w http.ResponseWriter, r *http.Request) {
	limit, offset := paginationParams(r, 100)
	out, err := h.svc.List(r.Context(), limit, offset)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, out)
}

func (h *BonusHandler) Get(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	b, err := h.svc.Get(r.Context(), id)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, b)
}

func (h *BonusHandler) ListByCasino(w http.ResponseWriter, r *http.Request) {
	casinoID, err := uuid.Parse(chi.URLParam(r, "casinoId"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid casino id")
		return
	}
	out, err := h.svc.ListByCasino(r.Context(), casinoID)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, out)
}

func (h *BonusHandler) Create(w http.ResponseWriter, r *http.Request) {
	var b models.Bonus
	if err := decodeJSON(r, &b); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	created, err := h.svc.Create(r.Context(), &b)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, created)
}

func (h *BonusHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	var b models.Bonus
	if err := decodeJSON(r, &b); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	b.ID = id
	updated, err := h.svc.Update(r.Context(), &b)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, updated)
}

func (h *BonusHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.svc.Delete(r.Context(), id); err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusNoContent, nil)
}
