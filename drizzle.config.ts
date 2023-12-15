import type { Config } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.POSTGRES_URL) {
	throw new Error('POSTGRES_URL is missing');
}
console.log(process.env);
export default {
	schema: './db/schema.ts',
	out: './db/migrations',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.POSTGRES_URL + '?ssl=true'
	}
} satisfies Config;
