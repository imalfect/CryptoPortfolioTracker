'use server';
import db from '../index';
import { holdings } from '../schema';
import { and, eq } from 'drizzle-orm';

export default async function removeUserHolding(userId: string, cryptocurrencyId: string) {
	return db
		.delete(holdings)
		.where(and(eq(holdings.userId, userId), eq(holdings.cryptocurrencyId, cryptocurrencyId)));
}
