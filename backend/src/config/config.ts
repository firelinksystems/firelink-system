export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,
  database: {
    url: process.env.DATABASE_URL || 'postgresql://firelink_user:firelink_password@localhost:5432/firelink'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret',
    expiresIn: '24h'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
  },
  gocardless: {
    accessToken: process.env.GOCARDLESS_ACCESS_TOKEN || '',
    webhookSecret: process.env.GOCARDLESS_WEBHOOK_SECRET || ''
  },
  email: {
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
};
