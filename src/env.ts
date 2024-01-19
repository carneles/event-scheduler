import * as dotenv from 'dotenv';
import * as path from 'path';

// this is to load .env file
dotenv.config({ path: path.join(process.cwd(), `.env${((process.env.NODE_ENV === 'test') ? '.test' : '')}`) });

export const env = {
    PORT: process.env.PORT || 3000,
    DATABASE_HOST: process.env.DB_HOST || 'localhost',
    DATABASE_PORT: process.env.DB_PORT || '27017',
    DATABASE_USER: process.env.DB_USER || 'root',
    DATABASE_PASSWORD: process.env.DB_PASSWORD || 'example',
    DATABASE_NAME: process.env.DB_NAME || 'event-scheduler',
    DATE_FORMAT: process.env.DATE_FORMAT || 'YYYY-MM-DD',
    DATE_TIME_FORMAT: process.env.DATE_TIME_FORMAT || 'YYYY-MM-DD HH:mm:ss'
};