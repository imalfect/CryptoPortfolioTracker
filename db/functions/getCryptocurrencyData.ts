'use server';
import db from '../index';
import { cryptocurrencies } from '../schema';
import { eq } from 'drizzle-orm';
import { ofetch } from 'ofetch';
// Simplified interface with only the data we need
interface CryptocurrencyData {
	id: string;
	name: string;
	symbol: string;
	image: {
		small: string;
	};
	market_data: {
		current_price: {
			usd: string;
		};
		price_change_percentage_24h: string;
	};
	error?: any;
}
export default async function getCryptocurrencyData(cryptocurrencyId: string): Promise<{
	id: string;
	name: string;
	symbol: string;
	icon: string;
	price: number;
}> {
	console.log(`Requesting cryptocurrency data for ${cryptocurrencyId}`);
	const cryptocurrencyData = await db
		.select()
		.from(cryptocurrencies)
		.where(eq(cryptocurrencies.id, cryptocurrencyId));
	if (cryptocurrencyData.length === 0) {
		// Cryptocurrency was not found
		const cryptoData = await ofetch<CryptocurrencyData>(
			`https://api.coingecko.com/api/v3/coins/${cryptocurrencyId}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
			{ ignoreResponseError: true, retry: 3, retryDelay: 500 }
		);
		if (cryptoData.error) {
			throw new Error('Cryptocurrency not found');
		}
		const cryptoPriceHistory = await ofetch<{ prices: [number, number][]; error?: any }>(
			`https://api.coingecko.com/api/v3/coins/${cryptocurrencyId}/market_chart?vs_currency=usd&days=30`,
			{ ignoreResponseError: true, retry: 3, retryDelay: 500 }
		);
		if (cryptoPriceHistory.error) {
			throw new Error('Cryptocurrency price history not found');
		}
		const priceHistoryArray = cryptoPriceHistory.prices.map((price) => price[1]);
		// @ts-ignore omg drizzle wtf
		return db
			.insert(cryptocurrencies)
			.values({
				id: cryptoData.id,
				name: cryptoData.name,
				symbol: cryptoData.symbol.toUpperCase(),
				icon: cryptoData.image.small,
				price: cryptoData.market_data.current_price.usd as unknown as number,
				change: cryptoData.market_data.price_change_percentage_24h,
				history: priceHistoryArray
			})
			.returning()[0];
	} else {
		// Cryptocurrency was found
		return cryptocurrencyData[0];
	}
}
