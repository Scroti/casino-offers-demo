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
});

