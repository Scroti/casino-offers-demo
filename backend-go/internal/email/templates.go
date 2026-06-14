package email

import (
	"fmt"
	"html"
	"strings"
)

func (r *Resend) shell(title, body string) string {
	return fmt.Sprintf(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>%s</title></head>
<body style="margin:0;padding:0;background:#f5f6fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background:#f5f6fa;padding:32px 16px">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06)">
      <tr>
        <td style="background:linear-gradient(135deg,#e85d04,#dc2626);padding:28px 32px;text-align:center;color:#fff">
          <div style="font-size:22px;font-weight:700;letter-spacing:.3px">%s</div>
        </td>
      </tr>
      <tr>
        <td style="padding:36px 36px 32px 36px;font-size:15px;line-height:1.6">
          %s
        </td>
      </tr>
      <tr>
        <td style="background:#f8f9fa;padding:20px 32px;text-align:center;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb">
          © %s &middot; You're receiving this because of an account or contact request.<br>
          Need help? Reply to this email.
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body></html>`, html.EscapeString(title), html.EscapeString(r.appName), body, html.EscapeString(r.appName))
}

func ctaButton(label, href string) string {
	return fmt.Sprintf(`<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td>
<a href="%s" style="display:inline-block;background:#e85d04;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600;font-size:14px">%s</a>
</td></tr></table>`, html.EscapeString(href), html.EscapeString(label))
}

func greeting(name string) string {
	if strings.TrimSpace(name) == "" {
		return "Hi,"
	}
	return "Hi " + html.EscapeString(name) + ","
}

func (r *Resend) verificationTemplate(name, link, code string) string {
	body := fmt.Sprintf(`
<p>%s</p>
<p>Welcome to <strong>%s</strong>! Confirm your email to activate your account.</p>
%s
<p style="margin:24px 0 6px 0;color:#6b7280;font-size:13px">Or enter this 6-digit code (expires in 15 minutes):</p>
<div style="font-size:28px;font-weight:700;letter-spacing:8px;background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;padding:14px 18px;border-radius:10px;display:inline-block">%s</div>
<p style="margin-top:24px;font-size:13px;color:#6b7280">The verification link expires in 24 hours. If you didn't sign up, you can ignore this email.</p>`,
		greeting(name),
		html.EscapeString(r.appName),
		ctaButton("Verify email", link),
		html.EscapeString(code),
	)
	return r.shell("Verify your email", body)
}

func (r *Resend) passwordResetTemplate(name, link string) string {
	body := fmt.Sprintf(`
<p>%s</p>
<p>We received a request to reset your <strong>%s</strong> password.</p>
%s
<p style="font-size:13px;color:#6b7280">This link expires in <strong>1 hour</strong>. If you didn't request a reset, you can safely ignore this email.</p>`,
		greeting(name),
		html.EscapeString(r.appName),
		ctaButton("Reset password", link),
	)
	return r.shell("Reset your password", body)
}

func (r *Resend) customTemplate(name, subject, message string) string {
	body := fmt.Sprintf(`
<p>%s</p>
<h2 style="font-size:18px;margin:8px 0 16px 0">%s</h2>
<div style="white-space:pre-wrap;font-size:15px;line-height:1.6;color:#1f2937">%s</div>`,
		greeting(name),
		html.EscapeString(subject),
		html.EscapeString(message),
	)
	return r.shell(subject, body)
}
