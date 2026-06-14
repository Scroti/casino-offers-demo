package handlers

import (
	"net/http"
	"strconv"

	"github.com/playwise-guru/backend/internal/services"
)

type NewsHandler struct{ svc *services.NewsService }

func NewNewsHandler(svc *services.NewsService) *NewsHandler { return &NewsHandler{svc: svc} }

func (h *NewsHandler) Fetch(w http.ResponseWriter, r *http.Request) {
	country := r.URL.Query().Get("country")
	limit := 20
	if v := r.URL.Query().Get("limit"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 && n <= 100 {
			limit = n
		}
	}
	articles, err := h.svc.Fetch(r.Context(), country, limit)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, articles)
}
