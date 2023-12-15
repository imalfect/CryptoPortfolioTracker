'use server';
import db from '../index';
import { holdings, users } from '../schema';
import { and, eq } from 'drizzle-orm';

export default async function setUserHolding(
	userId: string,
	cryptocurrencyId: string,
	amount: number
) {
	const user = await db.select().from(users).where(eq(users.id, userId));
	if (user.length === 0) {
		throw new Error('User does not exist');
	}
	const userHoldings = await db
		.select()
		.from(holdings)
		.where(and(eq(holdings.userId, userId), eq(holdings.cryptocurrencyId, cryptocurrencyId)));
	if (userHoldings.length === 0) {
		console.log('Holdings are empty, inserting new row');
		await db.insert(holdings).values({
			userId: userId,
			cryptocurrencyId: cryptocurrencyId,
			amount: amount
		});
	} else {
		await db
			.update(holdings)
			.set({
				amount: amount
			})
			.where(and(eq(holdings.userId, userId), eq(holdings.cryptocurrencyId, cryptocurrencyId)));
	}
}
