'use server';
import db from '../index';
import { cryptocurrencies, holdings } from '../schema';
import { eq, sql } from 'drizzle-orm';

export default async function getUserNetWorth(userId: string) {
	console.log(`Requesting net worth for user ${userId}`);
	const netWorth = await db
		.select({
			netWorth: sql<number>`SUM(${holdings.amount} * ${cryptocurrencies.price})`
		})
		.from(holdings)
		.innerJoin(cryptocurrencies, eq(cryptocurrencies.id, holdings.cryptocurrencyId))
		.where(eq(holdings.userId, userId))
		.groupBy(holdings.userId);
	if (netWorth.length === 0) {
		return 0;
	}
	return netWorth[0].netWorth;
}
