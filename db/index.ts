import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
const queryClient = postgres({
	host: process.env.POSTGRES_HOST!,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE!
});
export default drizzle(queryClient, { schema });
