'use client';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import getCryptocurrencyData from '../../db/functions/getCryptocurrencyData';
import setUserHolding from '../../db/functions/setUserHolding';
import { useToast } from '@/components/ui/use-toast';

export default function NewHoldingDialog(props: { userId: string; reload: () => void }) {
	const toast = useToast();
	const [error, setError] = useState('');
	const [cryptoUrl, setCryptoUrl] = useState('');
	const [cryptoUrlValid, setCryptoUrlValid] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const cryptoUrlRegex = new RegExp(
		'https://www.coingecko.com/en/coins/[a-zA-Z0-9-]+/?(\\?ref=coingecko)?$'
	);
	const cryptoUrlChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCryptoUrl(e.target.value);
		const match = cryptoUrlRegex.test(e.target.value);
		console.log(match);
		if (match) {
			setCryptoUrlValid(true);
		} else {
			setCryptoUrlValid(false);
		}
	};
	const createHolding = async () => {
		// Get the cryptocurrency ID from the URL
		const urlParts = cryptoUrl.split('/');
		const cryptocurrencyId = urlParts.pop();
		const cryptoInfo = await getCryptocurrencyData(cryptocurrencyId!).catch((e) => {
			setError(e.message);
		});
		if (cryptoInfo) {
			setUserHolding(props.userId, cryptocurrencyId!, 0)
				.catch((e) => {
					setError(e.message);
				})
				.then(() => {
					props.reload();
					toast.toast({
						title: '👍 Holding created',
						description: `You have created a new holding for ${cryptoInfo.name}.`,
						duration: 5000
					});
					setIsDialogOpen(false);
				});
		}
	};
	useEffect(() => {}, []);
	return (
		<Dialog
			open={isDialogOpen}
			onOpenChange={(status: boolean) => {
				setIsDialogOpen(status);
			}}
		>
			<DialogTrigger>
				<Button variant={'secondary'} size={'icon'} className={'w-40 h-40'}>
					<Plus size={80} />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a new holding</DialogTitle>
					<DialogDescription>
						Visit{' '}
						<a href={'https://coingecko.com'} target={'_blank'} rel={'noreferrer'}>
							CoinGecko
						</a>{' '}
						to find the cryptocurrency you want to add, copy its URL and paste it below.
					</DialogDescription>
				</DialogHeader>
				<div className={'flex flex-col items-center'}>
					<Input
						onChange={cryptoUrlChanged}
						color={'#FF0000'}
						className={clsx(
							'border-2',
							cryptoUrlValid ? 'border-green-500' : null,
							!cryptoUrlValid && cryptoUrl !== '' ? 'border-red-500' : null
						)}
					/>
					<Button
						className={'mt-4'}
						disabled={!cryptoUrlValid}
						onClick={() => {
							// noinspection JSIgnoredPromiseFromCall
							createHolding();
						}}
					>
						Create holding
					</Button>
					{error !== '' ? <p className={'text-red-500'}>{error}</p> : null}
				</div>
			</DialogContent>
		</Dialog>
	);
}
