import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
// @ts-ignore
const queryClient = postgres(process.env.POSTGRES_URL);
export default drizzle(queryClient, { schema });
