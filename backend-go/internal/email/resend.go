package email

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/resend/resend-go/v2"
)

type Resend struct {
	client      *resend.Client
	from        string
	appName     string
	frontendURL string
	logoURL     string
}

type Config struct {
	APIKey      string
	From        string
	AppName     string
	FrontendURL string
	LogoURL     string
}

func NewResend(cfg Config) *Resend {
	if cfg.AppName == "" {
		cfg.AppName = "Playwise Guru"
	}
	if cfg.LogoURL == "" && cfg.FrontendURL != "" {
		cfg.LogoURL = cfg.FrontendURL + "/assets/images/logo.png"
	}
	return &Resend{
		client:      resend.NewClient(cfg.APIKey),
		from:        cfg.From,
		appName:     cfg.AppName,
		frontendURL: cfg.FrontendURL,
		logoURL:     cfg.LogoURL,
	}
}

type Message struct {
	To      []string
	Subject string
	HTML    string
	Text    string
	ReplyTo string
}

func (r *Resend) Send(ctx context.Context, msg Message) error {
	params := &resend.SendEmailRequest{
		From:    fmt.Sprintf("%s <%s>", r.appName, r.from),
		To:      msg.To,
		Subject: msg.Subject,
		Html:    msg.HTML,
		Text:    msg.Text,
	}
	if msg.ReplyTo != "" {
		params.ReplyTo = msg.ReplyTo
	}
	_, err := r.client.Emails.SendWithContext(ctx, params)
	if err != nil {
		return fmt.Errorf("resend send: %w", err)
	}
	return nil
}

// SendVerification sends both a link + 6-digit code (parity with NestJS).
func (r *Resend) SendVerification(ctx context.Context, to, name, verificationLink, code string) {
	subject := fmt.Sprintf("Verify your %s account", r.appName)
	html := r.verificationTemplate(name, verificationLink, code)
	text := fmt.Sprintf("Verify your email: %s\nCode: %s (15 min)", verificationLink, code)
	r.sendAsync(ctx, Message{To: []string{to}, Subject: subject, HTML: html, Text: text})
}

func (r *Resend) SendPasswordReset(ctx context.Context, to, name, resetLink string) {
	subject := fmt.Sprintf("%s password reset", r.appName)
	html := r.passwordResetTemplate(name, resetLink)
	text := fmt.Sprintf("Reset your password: %s (expires in 1 hour)", resetLink)
	r.sendAsync(ctx, Message{To: []string{to}, Subject: subject, HTML: html, Text: text})
}

func (r *Resend) SendCustom(ctx context.Context, to, name, subject, message string) {
	html := r.customTemplate(name, subject, message)
	r.sendAsync(ctx, Message{To: []string{to}, Subject: subject, HTML: html, Text: message})
}

// sendAsync sends without blocking the caller. Email failures must never
// fail a signup/login/etc — we log and move on.
func (r *Resend) sendAsync(ctx context.Context, msg Message) {
	go func() {
		if err := r.Send(context.Background(), msg); err != nil {
			slog.Error("email send failed", "to", msg.To, "subject", msg.Subject, "err", err)
		}
	}()
}
