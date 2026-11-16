export interface AppConfiguration {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  corsOrigin: string;
  publicBaseUrl: string;
  maxFileSizeBytes: number;
  rateLimitTtl: number;
  rateLimitMax: number;
}

export default (): AppConfiguration => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4002', 10),
  mongodbUri:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/titan_logistics_db',
  corsOrigin:
    process.env.CORS_ORIGIN ||
    'http://localhost:3002,http://127.0.0.1:3002,http://localhost:3000,http://127.0.0.1:3000',
  publicBaseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:4002',
  maxFileSizeBytes: parseInt(process.env.MAX_FILE_SIZE_BYTES || '5242880', 10),
  rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL || '60000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '120', 10),
});
