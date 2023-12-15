'use server';
import db from '../index';
import { holdings } from '../schema';
import { and, eq } from 'drizzle-orm';

export default async function getUserTokenHolding(userId: string, cryptocurrencyId: string) {
	const userHolding = await db
		.select()
		.from(holdings)
		.where(and(eq(holdings.userId, userId), eq(holdings.cryptocurrencyId, cryptocurrencyId)));
	if (userHolding.length === 0) {
		throw new Error('User does not have this token');
	} else {
		return userHolding[0];
	}
}
