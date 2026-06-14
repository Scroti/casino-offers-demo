package handlers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/services"
)

type GuideHandler struct{ svc *services.GuideService }

func NewGuideHandler(svc *services.GuideService) *GuideHandler { return &GuideHandler{svc: svc} }

func (h *GuideHandler) List(w http.ResponseWriter, r *http.Request) {
	publishedOnly := r.URL.Query().Get("published") == "true"
	limit, offset := paginationParams(r, 100)
	out, err := h.svc.List(r.Context(), publishedOnly, limit, offset)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, out)
}

func (h *GuideHandler) Featured(w http.ResponseWriter, r *http.Request) {
	limit, _ := paginationParams(r, 10)
	out, err := h.svc.Featured(r.Context(), limit)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, out)
}

func (h *GuideHandler) ByCategory(w http.ResponseWriter, r *http.Request) {
	out, err := h.svc.ByCategory(r.Context(), chi.URLParam(r, "category"))
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, out)
}

func (h *GuideHandler) Get(w http.ResponseWriter, r *http.Request) {
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

func (h *GuideHandler) GetBySlug(w http.ResponseWriter, r *http.Request) {
	g, err := h.svc.GetBySlug(r.Context(), chi.URLParam(r, "slug"))
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, g)
}

func (h *GuideHandler) Create(w http.ResponseWriter, r *http.Request) {
	var g models.Guide
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

func (h *GuideHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	var g models.Guide
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

func (h *GuideHandler) Delete(w http.ResponseWriter, r *http.Request) {
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

func (h *GuideHandler) IncrementViews(w http.ResponseWriter, r *http.Request) {
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
