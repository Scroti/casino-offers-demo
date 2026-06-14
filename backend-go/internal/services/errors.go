package services

import "errors"

var (
	ErrNotFound           = errors.New("not found")
	ErrAlreadyExists      = errors.New("already exists")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrNotVerified        = errors.New("email not verified")
	ErrInvalidToken       = errors.New("invalid or expired token")
	ErrForbidden          = errors.New("forbidden")
)
