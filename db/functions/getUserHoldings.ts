'use server';
import db from '../index';
import { cryptocurrencies, holdings } from '../schema';
import { eq } from 'drizzle-orm';

export default async function getUserHoldings(userId: string) {
	console.log(`Requesting holdings for user ${userId}`);
	return db
		.select()
		.from(holdings)
		.where(eq(holdings.userId, userId))
		.innerJoin(cryptocurrencies, eq(cryptocurrencies.id, holdings.cryptocurrencyId));
}
