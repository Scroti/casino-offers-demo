import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().default(3000),
  APP_VERSIONING_DEFAULT_VERSION: Joi.alternatives().try(Joi.string(), Joi.number()).default('1'),

  // CORS
  CORS_ORIGINS: Joi.string().allow('').default(''),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().optional(),
  JWT_EXPIRES: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES: Joi.string().default('7d'),

  // Mongo remains as-is per user's request
  MONGO_DB_USER: Joi.string().optional(),
  MONGO_DB_PASSWORD: Joi.string().optional(),
  MONGO_DB_SERVER: Joi.string().optional(),
  MONGO_DB_NAME: Joi.string().optional(),

  // Google Sheets
  GOOGLE_SERVICE_ACCOUNT_EMAIL: Joi.string().email().optional(),
  GOOGLE_PRIVATE_KEY: Joi.string().optional(),
  GOOGLE_SHEETS_SPREADSHEET_ID: Joi.string().optional(),
  GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME: Joi.string().optional(),
  GOOGLE_SHEETS_SYNC_ENABLED: Joi.boolean().default(false),

  // Frontend URL for email links
  FRONTEND_URL: Joi.string().uri().optional().default('http://localhost:3000'),

  // SMTP Configuration for Nodemailer
  // SMTP_USER can be email (Gmail) or "apikey" (SendGrid) or username (other providers)
  SMTP_HOST: Joi.string().optional().default('smtp.gmail.com'),
  SMTP_PORT: Joi.string().optional().default('587'),
  SMTP_SECURE: Joi.string().optional().default('false'),
  SMTP_USER: Joi.string().optional(), // Not always an email - can be "apikey" for SendGrid
  SMTP_PASSWORD: Joi.string().optional(),
  EMAIL_FROM: Joi.string().email().optional(),
  EMAIL_LOGO_URL: Joi.string().uri().optional(), // Optional: custom logo URL for emails
});

