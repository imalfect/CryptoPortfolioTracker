'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CryptoHoldingCard from '@/components/CryptoHoldingCard';
import getUserHoldings from '../../../db/functions/getUserHoldings';
import getUserNetWorth from '../../../db/functions/getUserNetWorth';
import Image from 'next/image';
import NewHoldingCard from '@/components/NewHoldingCard';
interface Holding {
	cryptocurrency: {
		symbol: string;
		id: string;
		name: string;
		icon: string;
		price: number;
		change: number;
		history: number[];
	};
	holding: {
		userId: string;
		cryptocurrencyId: string;
		amount: number;
	};
}
const nf = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

export default function Page() {
	const { data: session, status } = useSession();
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [userHoldings, setUserHoldings] = useState<Holding[]>([]);
	const [netWorth, setNetWorth] = useState<number>(0);
	const [userId, setUserId] = useState<string>('');
	const router = useRouter();
	const userEmail = session?.user?.email;
	const getHoldings = async () => {
		// @ts-ignore
		const userId = session?.user?.id;
		setUserId(userId);
		const userHoldings = await getUserHoldings(userId);
		setUserHoldings(userHoldings);
		const nw = await getUserNetWorth(userId);
		setNetWorth(nw);
		setIsSignedIn(true);
	};
	useEffect(() => {
		if (status === 'authenticated') {
			console.log('Signed in as ' + userEmail);
			// noinspection JSIgnoredPromiseFromCall
			getHoldings();
		} else if (status === 'loading') {
			console.log('Hang on there...');
		} else {
			console.log('Not signed in.');
			router.push('/login');
		}
	}, [status]);
	return (
		<section className={'text-center flex flex-col items-center p-24'}>
			{isSignedIn ? (
				<>
					<h1 className="text-5xl font-extrabold">Dashboard</h1>
					<p className="text-xl font-medium mt-1">Welcome back, {session?.user?.name}!</p>
					<p className={'text-6xl font-bold mt-3 mb-4 '}>{nf.format(netWorth)}</p>
					<div className={'flex flex-row flex-wrap gap-4 justify-center'}>
						{userHoldings.map((holding) => {
							return (
								<CryptoHoldingCard
									data={holding.cryptocurrency.history}
									name={holding.cryptocurrency.name}
									symbol={holding.cryptocurrency.symbol}
									icon={holding.cryptocurrency.icon}
									holding={holding.holding.amount}
									change={parseFloat(holding.cryptocurrency.change.toFixed(2))}
									price={holding.cryptocurrency.price}
									key={holding.cryptocurrency.id}
									cryptocurrencyId={holding.cryptocurrency.id}
									userId={holding.holding.userId}
									reload={getHoldings}
								/>
							);
						})}
						<NewHoldingCard userId={userId} reload={getHoldings} />
					</div>
				</>
			) : (
				<>
					<h1 className="text-5xl font-extrabold">Loading</h1>
					<p className="text-xl font-medium mt-1">Meanwhile, watch the Blåhaj in a washing machine</p>
					<Image
						src={'/ikea_blahaj.gif'}
						width={300}
						height={300}
						alt={'Loading...'}
						className={'mt-2'}
					/>
				</>
			)}
		</section>
	);
}
