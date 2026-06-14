package handlers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/services"
)

type CasinoHandler struct{ svc *services.CasinoService }

func NewCasinoHandler(svc *services.CasinoService) *CasinoHandler { return &CasinoHandler{svc: svc} }

func (h *CasinoHandler) List(w http.ResponseWriter, r *http.Request) {
	limit, offset := paginationParams(r, 100)
	casinos, err := h.svc.List(r.Context(), limit, offset)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, casinos)
}

func (h *CasinoHandler) Get(w http.ResponseWriter, r *http.Request) {
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

func (h *CasinoHandler) Create(w http.ResponseWriter, r *http.Request) {
	var c models.Casino
	if err := decodeJSON(r, &c); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	created, err := h.svc.Create(r.Context(), &c)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, created)
}

func (h *CasinoHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	var c models.Casino
	if err := decodeJSON(r, &c); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	c.ID = id
	updated, err := h.svc.Update(r.Context(), &c)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, updated)
}

func (h *CasinoHandler) Delete(w http.ResponseWriter, r *http.Request) {
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
