package handlers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/services"
)

type GameHandler struct{ svc *services.GameService }

func NewGameHandler(svc *services.GameService) *GameHandler { return &GameHandler{svc: svc} }

func (h *GameHandler) List(w http.ResponseWriter, r *http.Request) {
	limit, offset := paginationParams(r, 100)
	out, err := h.svc.List(r.Context(), false, limit, offset)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, out)
}

func (h *GameHandler) ListActive(w http.ResponseWriter, r *http.Request) {
	limit, offset := paginationParams(r, 100)
	out, err := h.svc.List(r.Context(), true, limit, offset)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, out)
}

func (h *GameHandler) Get(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	g, err := h.svc.Get(r.Context(), id)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, g)
}

func (h *GameHandler) GetByGameID(w http.ResponseWriter, r *http.Request) {
	g, err := h.svc.GetByGameID(r.Context(), chi.URLParam(r, "gameId"))
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, g)
}

func (h *GameHandler) Create(w http.ResponseWriter, r *http.Request) {
	var g models.Game
	if err := decodeJSON(r, &g); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	created, err := h.svc.Create(r.Context(), &g)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, created)
}

func (h *GameHandler) Seed(w http.ResponseWriter, r *http.Request) {
	var games []models.Game
	if err := decodeJSON(r, &games); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	created, err := h.svc.BulkCreate(r.Context(), games)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{"created": len(created), "games": created})
}

func (h *GameHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	var g models.Game
	if err := decodeJSON(r, &g); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	g.ID = id
	updated, err := h.svc.Update(r.Context(), &g)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, updated)
}

func (h *GameHandler) Delete(w http.ResponseWriter, r *http.Request) {
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

func (h *GameHandler) IncrementViews(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.svc.IncrementViews(r.Context(), id); err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"message": "ok"})
}

func (h *GameHandler) IncrementPlays(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.svc.IncrementPlays(r.Context(), id); err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"message": "ok"})
}
