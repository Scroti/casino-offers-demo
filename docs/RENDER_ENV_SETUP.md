# Render Environment Variables Setup

## ⚠️ Security Note
**Never commit API keys or secrets to git!** Always use environment variables in your hosting platform.

---

## 📋 SendGrid Configuration for Render

Add these environment variables to your **Render Backend Service**:

### Step-by-Step:

1. Go to your **Render Dashboard**
2. Select your **Backend Service** (the NestJS server)
3. Click on **"Environment"** tab
4. Click **"Add Environment Variable"** for each variable below

---

## 🔑 Environment Variables to Add

Add these **one by one** (click "Add" after each):

### 1. SMTP_HOST
```
Key: SMTP_HOST
Value: smtp.sendgrid.net
```

### 2. SMTP_PORT
```
Key: SMTP_PORT
Value: 587
```

### 3. SMTP_SECURE
```
Key: SMTP_SECURE
Value: false
```

### 4. SMTP_USER
```
Key: SMTP_USER
Value: apikey
```
**⚠️ Important**: Must be exactly `apikey` (lowercase, no spaces)

### 5. SMTP_PASSWORD
```
Key: SMTP_PASSWORD
Value: SG.your_sendgrid_api_key_here
```
**⚠️ Important**: Replace `SG.your_sendgrid_api_key_here` with your actual SendGrid API key (starts with `SG.`)

### 6. EMAIL_FROM
```
Key: EMAIL_FROM
Value: cristimbusiness@gmail.com
```
**⚠️ Important**: Must match your verified sender email in SendGrid

### 7. FRONTEND_URL
```
Key: FRONTEND_URL
Value: https://main.d3kx4j7iryk92n.amplifyapp.com
```
**⚠️ Important**: Your actual frontend URL (where email links will point)

---

## ✅ Complete Configuration

After adding all variables, your Render environment should have:

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_sendgrid_api_key_here
EMAIL_FROM=your-verified-email@gmail.com
FRONTEND_URL=https://your-frontend-url.com
```

**Replace:**
- `SG.your_sendgrid_api_key_here` → Your actual SendGrid API key
- `your-verified-email@gmail.com` → Your verified sender email
- `https://your-frontend-url.com` → Your actual frontend URL

---

## 🔄 Next Steps

1. **Save all environment variables** in Render
2. **Restart/Redeploy** your backend service (Render will do this automatically)
3. **Test email sending** by signing up a new user
4. **Check SendGrid dashboard** → Activity → Email Activity to see sent emails

---

## 🧪 Testing

After deployment:
1. Try signing up a new user on your app
2. Check server logs for email sending status
3. Check your email inbox (`cristimbusiness@gmail.com`) - also check spam
4. Check SendGrid dashboard → Activity feed

---

## 🚨 Important Security Reminders

- ✅ API key is now in Render environment variables (secure)
- ❌ Never commit this API key to git
- ❌ Never share this API key publicly
- ✅ If compromised, rotate it in SendGrid dashboard
- ✅ Render encrypts environment variables at rest

---

## ✅ Verification Checklist

- [ ] All 7 environment variables added to Render
- [ ] `SMTP_USER` is exactly `apikey` (lowercase)
- [ ] `SMTP_PASSWORD` is your complete API key
- [ ] `EMAIL_FROM` matches your verified SendGrid sender email
- [ ] `FRONTEND_URL` is your actual frontend URL
- [ ] Backend service redeployed/restarted
- [ ] Test email sent successfully
- [ ] Email received in inbox

---

**You're all set!** 🎉 Your email service should now work in production.

