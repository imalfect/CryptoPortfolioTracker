import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
/*const migrationClient = postgres({
	host: process.env.DATABASE_HOST!,
	port: Number(process.env.DATABASE_PORT),
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME!,
	max: 1
});
migrate(drizzle(migrationClient), './db/migrations');*/
const queryClient = postgres({
	host: process.env.POSTGRES_HOST!,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE!
});
export default drizzle(queryClient, { schema });
