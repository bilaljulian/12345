// env.mjs

// Server Configuration
export const SERVER_PORT = process.env.SERVER_PORT || 3000;
export const SERVER_HOST = process.env.SERVER_HOST || 'localhost';

// Database Configuration
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || 5432;
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
export const DB_NAME = process.env.DB_NAME || 'enull_db';

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

// Stripe Configuration
export const STRIPE_API_KEY = process.env.STRIPE_API_KEY || 'your_stripe_api_key';
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key';

// Mailer Configuration
export const MAILER_SERVICE = process.env.MAILER_SERVICE || 'gmail';
export const MAILER_USER = process.env.MAILER_USER || 'your_email@gmail.com';
export const MAILER_PASSWORD = process.env.MAILER_PASSWORD || 'your_email_password';
export const MAILER_FROM = process.env.MAILER_FROM || 'no-reply@enull.com';

// Third-Party API Keys
export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'your_google_api_key';
export const FACEBOOK_API_KEY = process.env.FACEBOOK_API_KEY || 'your_facebook_api_key';

// Security Configuration
export const CORS_ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000';

// Logging Configuration
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Other Configurations
export const FEATURED_LISTINGS_LIMIT = process.env.FEATURED_LISTINGS_LIMIT || 10;
export const ITEM_PER_PAGE = process.env.ITEM_PER_PAGE || 20;

