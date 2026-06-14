package handlers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"github.com/playwise-guru/backend/internal/auth"
	"github.com/playwise-guru/backend/internal/models"
	"github.com/playwise-guru/backend/internal/services"
)

type UserHandler struct{ svc *services.UserService }

func NewUserHandler(svc *services.UserService) *UserHandler { return &UserHandler{svc: svc} }

func (h *UserHandler) List(w http.ResponseWriter, r *http.Request) {
	limit, offset := paginationParams(r, 100)
	users, err := h.svc.List(r.Context(), limit, offset)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, users)
}

func (h *UserHandler) Get(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	u, err := h.svc.Get(r.Context(), id)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, u)
}

type adminCreateUserReq struct {
	Name     string      `json:"name"`
	Email    string      `json:"email" validate:"required,email"`
	Password string      `json:"password" validate:"required,min=6"`
	Role     models.Role `json:"role"`
}

func (h *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req adminCreateUserReq
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	u, err := h.svc.AdminCreate(r.Context(), services.AdminCreateUserInput{
		Name: req.Name, Email: req.Email, Password: req.Password, Role: req.Role,
	})
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, u)
}

func (h *UserHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	claims, _ := auth.ClaimsFromContext(r.Context())
	if err := h.svc.Delete(r.Context(), id, claims.UserID); err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusNoContent, nil)
}

type setStatusReq struct {
	Status models.Status `json:"status" validate:"required"`
}

func (h *UserHandler) SetStatus(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	var req setStatusReq
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	claims, _ := auth.ClaimsFromContext(r.Context())
	if err := h.svc.SetStatus(r.Context(), id, claims.UserID, req.Status); err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"message": "status updated"})
}

type setRoleReq struct {
	Role models.Role `json:"role" validate:"required"`
}

func (h *UserHandler) SetRole(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	var req setRoleReq
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	claims, _ := auth.ClaimsFromContext(r.Context())
	if err := h.svc.SetRole(r.Context(), id, claims.UserID, req.Role); err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"message": "role updated"})
}

func (h *UserHandler) Verify(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.svc.Verify(r.Context(), id); err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"message": "user verified"})
}

type sendEmailReq struct {
	Subject string `json:"subject" validate:"required"`
	Message string `json:"message" validate:"required"`
}

func (h *UserHandler) SendEmail(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	var req sendEmailReq
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.svc.SendCustomEmail(r.Context(), id, req.Subject, req.Message); err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"message": "email queued"})
}

type bulkIDsReq struct {
	UserIDs []uuid.UUID `json:"userIds" validate:"required,min=1"`
}

func (h *UserHandler) BulkDelete(w http.ResponseWriter, r *http.Request) {
	var req bulkIDsReq
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	claims, _ := auth.ClaimsFromContext(r.Context())
	count, err := h.svc.BulkDelete(r.Context(), req.UserIDs, claims.UserID)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]int{"deleted": count})
}

type bulkStatusReq struct {
	UserIDs []uuid.UUID   `json:"userIds" validate:"required,min=1"`
	Status  models.Status `json:"status" validate:"required"`
}

func (h *UserHandler) BulkSetStatus(w http.ResponseWriter, r *http.Request) {
	var req bulkStatusReq
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	claims, _ := auth.ClaimsFromContext(r.Context())
	count, err := h.svc.BulkSetStatus(r.Context(), req.UserIDs, claims.UserID, req.Status)
	if err != nil {
		writeAppError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]int{"updated": count})
}
