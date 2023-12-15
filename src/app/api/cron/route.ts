import type { NextApiRequest, NextApiResponse } from 'next';
import { headers } from 'next/headers';
import db from '../../../../db/index';
import { cryptocurrencies } from '../../../../db/schema';
import { ofetch } from 'ofetch';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
type ResponseData = {
	ok: boolean;
};
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
	status?: {
		statusCode: number;
	};
}
// ... (your existing imports and code)

async function handleChunk(cryptosChunk: any[]) {
	console.log(`Processing chunk with ${cryptosChunk.length} cryptocurrencies...`);

	for (const crypto of cryptosChunk) {
		try {
			console.log(`Processing cryptocurrency ${crypto.id}...`);

			// Cryptocurrency data fetching and processing code here

			const cryptoData = await ofetch<CryptocurrencyData>(
				`https://api.coingecko.com/api/v3/coins/${crypto.id}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
				{ ignoreResponseError: true, retry: 3, retryDelay: 62000 }
			);

			if (cryptoData.error) {
				throw new Error('Cryptocurrency not found');
			}
			if (cryptoData.status && cryptoData.status.statusCode === 429) {
				console.log(
					'Rate limit exceeded. Rescheduling chunk and remaining chunks for the next minute.'
				);
				rescheduleChunks(cryptosChunk);
				return;
			}

			const cryptoPriceHistory = await ofetch<{
				prices: [number, number][];
				error?: any;
				status?: { errorCode: number };
			}>(`https://api.coingecko.com/api/v3/coins/${crypto.id}/market_chart?vs_currency=usd&days=30`, {
				ignoreResponseError: true,
				retry: 3,
				retryDelay: 62000
			});

			if (cryptoPriceHistory.error) {
				throw new Error('Cryptocurrency price history not found');
			}
			if (cryptoPriceHistory.status && cryptoPriceHistory.status.errorCode === 429) {
				console.log(
					'Rate limit exceeded. Rescheduling chunk and remaining chunks for the next minute.'
				);
				rescheduleChunks(cryptosChunk);
				return;
			}

			const priceHistoryArray = cryptoPriceHistory.prices.map((price) => price[1]);

			await db
				.update(cryptocurrencies)
				.set({
					name: cryptoData.name,
					symbol: cryptoData.symbol.toUpperCase(),
					icon: cryptoData.image.small,
					price: cryptoData.market_data.current_price.usd as unknown as number,
					change: cryptoData.market_data.price_change_percentage_24h as unknown as number,
					history: priceHistoryArray
				})
				.where(eq(cryptocurrencies.id, crypto.id));

			console.log(`Cryptocurrency ${crypto.id} processed successfully.`);
		} catch (error) {
			console.error(`Error processing cryptocurrency ${crypto.id}:`, error);
		}
	}

	console.log(`Chunk processed.`);
}

function rescheduleChunks(cryptosChunk: any[]) {
	const chunkSize = cryptosChunk.length;
	const totalChunks = Math.ceil(cryptosChunk.length / chunkSize);

	console.log(`Rescheduling all chunks for the next minute...`);

	for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
		const start = chunkIndex * chunkSize;
		const end = start + chunkSize;
		const rescheduledChunk = cryptosChunk.slice(start, end);

		setTimeout(
			async () => {
				try {
					await handleChunk(rescheduledChunk);
				} catch (error) {
					console.error('Error rescheduling chunk:', error);
				}
			},
			(chunkIndex + 1) * 61000
		);
	}
}

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
	const headersList = headers();
	if (headersList.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
		return NextResponse.json('Unauthorized', { status: 401 });
	}
	const cryptos = await db
		.select({
			id: cryptocurrencies.id
		})
		.from(cryptocurrencies);

	const chunkSize = 14;
	const totalChunks = Math.ceil(cryptos.length / chunkSize);

	console.log(
		`Total Cryptocurrencies: ${cryptos.length}, Chunk Size: ${chunkSize}, Total Chunks: ${totalChunks}`
	);

	for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
		const start = chunkIndex * chunkSize;
		const end = start + chunkSize;
		const cryptosChunk = cryptos.slice(start, end);

		console.log(
			`Scheduling chunk ${chunkIndex + 1} for execution after ${(chunkIndex + 1) * 61} seconds...`
		);

		// Execute the chunk after 1 minute and 1 second
		setTimeout(
			async () => {
				try {
					await handleChunk(cryptosChunk);
				} catch (error) {
					console.error('Error processing chunk:', error);
				}
			},
			(chunkIndex + 1) * 61000
		); // 61000 milliseconds is 1 minute and 1 second
	}

	console.log('All chunks scheduled.');

	return NextResponse.json({ ok: true });
}

export { handler as GET };
